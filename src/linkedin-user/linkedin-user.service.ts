import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { nodeDetails, nodeType } from 'src/flows/types';
import { LinkedinProfileService } from 'src/linkedin-profile/linkedin-profile.service';
import { LIUserContact } from 'src/liuser-contact/liuser-contact.entity';
import { MessageHistoryService } from 'src/message-history/message-history.service';
import { MessageHistory } from 'src/message-history/messageHistory.entity';
import { TagsService } from 'src/tags/tags.service';
import { UsersService } from 'src/users/users.service';
import { QueryBuilder, Repository, SelectQueryBuilder } from 'typeorm';
import { LIHelperType } from './dto/create-lihelper.dto';
import { Element } from './dto/create-liuser-SNC.dto';
import { UpdateLIUserDTO } from './dto/update-liuser.dto';
import { UpdateTagLIUserDTO } from './dto/update-tag-liuser.dto';
import { LinkedinUser } from './linkedinUser.entity';
import { CRMFilters } from './types';
import { parseName } from 'humanparser';
import { FlowsService } from 'src/flows/flows.service';

@Injectable()
export class LinkedinUserService {
  constructor(
    @InjectRepository(LinkedinUser)
    private linekdinUserRepository: Repository<LinkedinUser>,
    private linkedinProfileService: LinkedinProfileService,
    private messageHistoryService: MessageHistoryService,
    private tagsServies: TagsService,
    private usersService: UsersService,
    @Inject(forwardRef(() => FlowsService))
    private flowsService: FlowsService,
  ) {}

  async createFromSN(
    elements: Element[],
    queueId: number,
    linkedinProfileId: number,
    userId: number,
  ) {
    const convertedDto: LinkedinUser[] = [];

    console.time();

    const linkedinProfile = await this.linkedinProfileService.findOneById(
      linkedinProfileId,
    );
    const user = await this.usersService.findOneById(userId);
    const queue = await this.flowsService.findOneQueue(queueId);

    // const queue = await this.qu

    for (const element of elements) {
      // If user was already added by another LinkedinProfile in the DB
      const snHashId = element.entityUrn.match(/\(([^)]+)\)/)[1];
      const hash_id = snHashId.split(',')[0];
      const member_id = element.objectUrn.split(':')[3];

      if (member_id) {
        const linkedinUserFoundInDB = await this.findOneByMemberId(member_id);
        if (linkedinUserFoundInDB) {
          if (
            linkedinUserFoundInDB.linkedin_profiles.find(
              (linkedin_profile) => linkedin_profile.id === linkedinProfile.id,
            )
          )
            continue;
          const messageHistory = await this.messageHistoryService.create(
            linkedinProfile,
            linkedinUserFoundInDB,
          );
          linkedinUserFoundInDB.message_histories.push(messageHistory);
          linkedinUserFoundInDB.linkedin_profiles.push(linkedinProfile);
          convertedDto.push(linkedinUserFoundInDB);
          continue;
        }
      }

      const liuserContact = new LIUserContact();
      const messageHistory = new MessageHistory();
      messageHistory.linekdin_profile = linkedinProfile;
      messageHistory.messages = [];

      const convertedObj = <LinkedinUser>{};

      convertedObj.users = [user];
      convertedObj.linkedin_profiles = [linkedinProfile];
      convertedObj.message_histories = [messageHistory];
      convertedObj.liUserContact = liuserContact;

      convertedObj.full_name = element.fullName;
      convertedObj.first_name = element.firstName;
      convertedObj.last_name = element.lastName;
      convertedObj.profile_url = `https://www.linkedin.com/sales/people/${hash_id}`;
      convertedObj.public_id = '';
      convertedObj.hash_id = hash_id;
      convertedObj.member_id = parseInt(member_id);
      convertedObj.location = element.geoRegion;
      convertedObj.open_profile = element.openLink;
      convertedObj.premium = element.premium;

      const currentCompany = element.currentPositions[0];
      convertedObj.current_company_name = currentCompany.companyName;
      convertedObj.current_company_position = currentCompany.title;

      convertedObj.avatar_url = '';
      if (element.profilePictureDisplayImage) {
        const imgArtifacts = element.profilePictureDisplayImage.artifacts;
        const fileIdSegment =
          imgArtifacts[imgArtifacts.length - 1].fileIdentifyingUrlPathSegment;
        convertedObj.avatar_url = `${element.profilePictureDisplayImage.rootUrl}${fileIdSegment}`;
      }

      for (let i = 1; i <= 10; i++) {
        if (i > element.currentPositions.length) break;
        const {
          companyName,
          companyUrn,
          startedOn,
          title,
        } = element.currentPositions[i - 1];
        convertedObj[`company_name_${i}`] = companyName;
        convertedObj[`company_id_${i}`] = companyUrn.split(':')[3];
        convertedObj[`company_position_${i}`] = title;
        convertedObj[
          `company_start_date_${i}`
        ] = `${startedOn.year}.${startedOn.month}`;
      }
      convertedDto.push(convertedObj);
    }

    const savedUsers = await this.linekdinUserRepository.save(convertedDto, {
      chunk: 25,
    });
    queue.collected_users.push(...savedUsers);
    this.flowsService.updateQueue(queue);
    console.timeEnd();
    return convertedDto.length;
  }

  async createFromLIHelper(
    liHelperData: LIHelperType[],
    linkedinProfileId: number,
    userId: number,
  ): Promise<void> {
    const convertedDto: LinkedinUser[] = [];
    console.time();
    const linkedinProfile = await this.linkedinProfileService.findOneById(
      linkedinProfileId,
    );
    const user = await this.usersService.findOneById(userId);

    for (const linkedinUser of liHelperData) {
      // If user was already added by another LinkedinProfile in the DB
      if (linkedinUser.member_id) {
        const linkedinUserFoundInDB = await this.findOneByMemberId(
          linkedinUser.member_id,
        );

        if (linkedinUserFoundInDB) {
          if (
            linkedinUserFoundInDB.linkedin_profiles.find(
              (linkedin_profile) => linkedin_profile.id === linkedinProfile.id,
            )
          )
            continue;
          const messageHistory = await this.messageHistoryService.create(
            linkedinProfile,
            linkedinUserFoundInDB,
          );
          linkedinUserFoundInDB.message_histories.push(messageHistory);
          linkedinUserFoundInDB.linkedin_profiles.push(linkedinProfile);
          convertedDto.push(linkedinUserFoundInDB);
          continue;
        }
      }

      const liuserContact = new LIUserContact();
      const messageHistory = new MessageHistory();
      messageHistory.linekdin_profile = linkedinProfile;
      messageHistory.messages = [];

      const convertedObj = <LinkedinUser>{};

      convertedObj.users = [user];
      convertedObj.linkedin_profiles = [linkedinProfile];
      convertedObj.message_histories = [messageHistory];
      convertedObj.liUserContact = liuserContact;

      convertedObj.full_name = linkedinUser.full_name;
      convertedObj.first_name = linkedinUser.first_name;
      convertedObj.last_name = linkedinUser.last_name;
      convertedObj.profile_url = linkedinUser.profile_url;
      convertedObj.avatar_url = linkedinUser.avatar;
      convertedObj.hash_id = linkedinUser.hash_id;
      convertedObj.member_id = pasrseIntIfExists(linkedinUser.member_id);
      convertedObj.headline = linkedinUser.headline;
      convertedObj.location = linkedinUser.location_name;
      convertedObj.industry = linkedinUser.industry;
      convertedObj.summary = linkedinUser.summary;
      convertedObj.birthday = linkedinUser.birthday;
      convertedObj.open_profile = sqlBoolToJS(linkedinUser.badges_open_link);
      convertedObj.premium = sqlBoolToJS(linkedinUser.badges_premium);
      convertedObj.email = linkedinUser.email;
      convertedObj.phone_number = linkedinUser.phone_1;
      convertedObj.connected_at = linkedinUser.connected_at;
      convertedObj.current_company_name = linkedinUser.current_company;
      convertedObj.current_company_position =
        linkedinUser.current_company_position;

      convertedObj.company_name_1 = linkedinUser.organization_1;
      convertedObj.company_id_1 = linkedinUser.organization_id_1;
      convertedObj.company_url_1 = linkedinUser.organization_url_1;
      convertedObj.company_website_1 = linkedinUser.organization_website_1;
      convertedObj.company_position_1 = linkedinUser.organization_title_1;
      convertedObj.company_position_description_1 =
        linkedinUser.organization_description_1;
      convertedObj.company_position_location_1 =
        linkedinUser.organization_location_1;
      convertedObj.company_start_date_1 = linkedinUser.organization_start_1;
      convertedObj.company_end_date_1 = linkedinUser.organization_end_1;

      convertedObj.company_name_2 = linkedinUser.organization_2;
      convertedObj.company_id_2 = linkedinUser.organization_id_2;
      convertedObj.company_url_2 = linkedinUser.organization_url_2;
      convertedObj.company_website_2 = linkedinUser.organization_website_2;
      convertedObj.company_position_2 = linkedinUser.organization_title_2;
      convertedObj.company_position_description_2 =
        linkedinUser.organization_description_2;
      convertedObj.company_position_location_2 =
        linkedinUser.organization_location_2;
      convertedObj.company_start_date_2 = linkedinUser.organization_start_2;
      convertedObj.company_end_date_2 = linkedinUser.organization_end_2;

      convertedObj.company_name_3 = linkedinUser.organization_3;
      convertedObj.company_id_3 = linkedinUser.organization_id_3;
      convertedObj.company_url_3 = linkedinUser.organization_url_3;
      convertedObj.company_website_3 = linkedinUser.organization_website_3;
      convertedObj.company_position_3 = linkedinUser.organization_title_3;
      convertedObj.company_position_description_3 =
        linkedinUser.organization_description_3;
      convertedObj.company_position_location_3 =
        linkedinUser.organization_location_3;
      convertedObj.company_start_date_3 = linkedinUser.organization_start_3;
      convertedObj.company_end_date_3 = linkedinUser.organization_end_3;

      convertedObj.company_name_4 = linkedinUser.organization_4;
      convertedObj.company_id_4 = linkedinUser.organization_id_4;
      convertedObj.company_url_4 = linkedinUser.organization_url_4;
      convertedObj.company_website_4 = linkedinUser.organization_website_4;
      convertedObj.company_position_4 = linkedinUser.organization_title_4;
      convertedObj.company_position_description_4 =
        linkedinUser.organization_description_4;
      convertedObj.company_position_location_4 =
        linkedinUser.organization_location_4;
      convertedObj.company_start_date_4 = linkedinUser.organization_start_4;
      convertedObj.company_end_date_4 = linkedinUser.organization_end_4;

      convertedObj.company_name_5 = linkedinUser.organization_5;
      convertedObj.company_id_5 = linkedinUser.organization_id_5;
      convertedObj.company_url_5 = linkedinUser.organization_url_5;
      convertedObj.company_website_5 = linkedinUser.organization_website_5;
      convertedObj.company_position_5 = linkedinUser.organization_title_5;
      convertedObj.company_position_description_5 =
        linkedinUser.organization_description_5;
      convertedObj.company_position_location_5 =
        linkedinUser.organization_location_5;
      convertedObj.company_start_date_5 = linkedinUser.organization_start_5;
      convertedObj.company_end_date_5 = linkedinUser.organization_end_5;

      convertedObj.company_name_6 = linkedinUser.organization_6;
      convertedObj.company_id_6 = linkedinUser.organization_id_6;
      convertedObj.company_url_6 = linkedinUser.organization_url_6;
      convertedObj.company_website_6 = linkedinUser.organization_website_6;
      convertedObj.company_position_6 = linkedinUser.organization_title_6;
      convertedObj.company_position_description_6 =
        linkedinUser.organization_description_6;
      convertedObj.company_position_location_6 =
        linkedinUser.organization_location_6;
      convertedObj.company_start_date_6 = linkedinUser.organization_start_6;
      convertedObj.company_end_date_6 = linkedinUser.organization_end_6;

      convertedObj.company_name_7 = linkedinUser.organization_7;
      convertedObj.company_id_7 = linkedinUser.organization_id_7;
      convertedObj.company_url_7 = linkedinUser.organization_url_7;
      convertedObj.company_website_7 = linkedinUser.organization_website_7;
      convertedObj.company_position_7 = linkedinUser.organization_title_7;
      convertedObj.company_position_description_7 =
        linkedinUser.organization_description_7;
      convertedObj.company_position_location_7 =
        linkedinUser.organization_location_7;
      convertedObj.company_start_date_7 = linkedinUser.organization_start_7;
      convertedObj.company_end_date_7 = linkedinUser.organization_end_7;

      convertedObj.company_name_8 = linkedinUser.organization_8;
      convertedObj.company_id_8 = linkedinUser.organization_id_8;
      convertedObj.company_url_8 = linkedinUser.organization_url_8;
      convertedObj.company_website_8 = linkedinUser.organization_website_8;
      convertedObj.company_position_8 = linkedinUser.organization_title_8;
      convertedObj.company_position_description_8 =
        linkedinUser.organization_description_8;
      convertedObj.company_position_location_8 =
        linkedinUser.organization_location_8;
      convertedObj.company_start_date_8 = linkedinUser.organization_start_8;
      convertedObj.company_end_date_8 = linkedinUser.organization_end_8;

      convertedObj.company_name_9 = linkedinUser.organization_9;
      convertedObj.company_id_9 = linkedinUser.organization_id_9;
      convertedObj.company_url_9 = linkedinUser.organization_url_9;
      convertedObj.company_website_9 = linkedinUser.organization_website_9;
      convertedObj.company_position_9 = linkedinUser.organization_title_9;
      convertedObj.company_position_description_9 =
        linkedinUser.organization_description_9;
      convertedObj.company_position_location_9 =
        linkedinUser.organization_location_9;
      convertedObj.company_start_date_9 = linkedinUser.organization_start_9;
      convertedObj.company_end_date_9 = linkedinUser.organization_end_9;

      convertedObj.company_name_10 = linkedinUser.organization_10;
      convertedObj.company_id_10 = linkedinUser.organization_id_10;
      convertedObj.company_url_10 = linkedinUser.organization_url_10;
      convertedObj.company_website_10 = linkedinUser.organization_website_10;
      convertedObj.company_position_10 = linkedinUser.organization_title_10;
      convertedObj.company_position_description_10 =
        linkedinUser.organization_description_10;
      convertedObj.company_position_location_10 =
        linkedinUser.organization_location_10;
      convertedObj.company_start_date_10 = linkedinUser.organization_start_10;
      convertedObj.company_end_date_10 = linkedinUser.organization_end_10;

      convertedDto.push(convertedObj);
    }

    await this.linekdinUserRepository.save(convertedDto, { chunk: 25 });
    console.timeEnd();
    return;
  }

  async updateTag(updateTagLIUserDto: UpdateTagLIUserDTO) {
    const { tagId, actionType, LIUserId } = updateTagLIUserDto;
    const user = await this.linekdinUserRepository.findOne(LIUserId);

    if (actionType === 'add') {
      const tag = await this.tagsServies.findOne(tagId);
      user.tags.push(tag);
    }
    if (actionType === 'remove') {
      _.remove(user.tags, (currentObject) => currentObject.id === tagId);
    }

    return this.linekdinUserRepository.save(user);
  }

  async update(updateLIUserDto: UpdateLIUserDTO) {
    const { id } = updateLIUserDto;
    const user = await this.linekdinUserRepository.findOne(id);

    _.merge(user, updateLIUserDto);

    return await this.linekdinUserRepository.save(user);
  }

  async findOneById(id: number): Promise<LinkedinUser> {
    return this.linekdinUserRepository.findOne(id);
  }

  queryBuilderFilters(
    filters: CRMFilters,
    nodeDetails?: nodeDetails,
  ): SelectQueryBuilder<LinkedinUser> {
    const {
      contactDateFilter,
      premiumProfileFilter,
      openProfileFilter,
      userStateFilter,
      tagsFilter,
      nameSearchFilter,
    } = filters;

    const queryBuilder = this.linekdinUserRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.liUserContact', 'liUserContact')
      .leftJoinAndSelect('user.linkedin_profiles', 'linkedin_profiles');

    if (nameSearchFilter) {
      queryBuilder.andWhere('user.full_name ilike :name', {
        name: `%${nameSearchFilter}%`,
      });
    }

    if (premiumProfileFilter)
      queryBuilder.andWhere('user.premium = :premium', {
        premium: premiumProfileFilter,
      });

    if (openProfileFilter)
      queryBuilder.andWhere('user.open_profile = :openProfile', {
        openProfile: openProfileFilter,
      });

    if (userStateFilter.length > 0)
      queryBuilder.andWhere('user.state in (:...states)', {
        states: userStateFilter,
      });

    // console.log(tagsFilter);

    if (tagsFilter.length > 0) {
      queryBuilder.innerJoin('user.tags', 'tag', 'tag.id in (:...tagIds)', {
        tagIds: tagsFilter,
      });
    }

    if (nodeDetails) {
      const { id, type, nodeType } = nodeDetails;
      if (nodeType === 'Inmail') {
        if (type === 'failed_users') {
          queryBuilder.innerJoin(
            'user.inmail_failed',
            'inmailNodes',
            'inmailNodes.id = :id',
            { id },
          );
        }
        if (type === 'success_users') {
          queryBuilder.innerJoin(
            'user.inmail_success',
            'inmailNodes',
            'inmailNodes.id = :id',
            { id },
          );
        }
      }
      if (nodeType === 'Queue') {
        queryBuilder.innerJoin(
          'user.queue_collected',
          'queueNodes',
          'queueNodes.id = :id',
          { id },
        );
      }
    }

    if (contactDateFilter.length > 0) {
      queryBuilder.andWhere('liUserContact.last_time_of_contact < :before', {
        before: contactDateFilter[contactDateFilter.length - 1],
      });
      if (contactDateFilter.length > 1) {
        queryBuilder.andWhere('liUserContact.last_time_of_contact > :after', {
          after: contactDateFilter[0],
        });
      }
    }

    queryBuilder.leftJoinAndSelect('user.tags', 'tags');
    return queryBuilder;
  }

  async paginate(
    options: IPaginationOptions,
    filters: CRMFilters,
    nodeDetails?: nodeDetails,
  ): Promise<Pagination<LinkedinUser>> {
    const queryBuilder = this.queryBuilderFilters(filters, nodeDetails);
    return paginate<LinkedinUser, IPaginationMeta>(queryBuilder, options);
  }

  async findOneByHashId(
    linkedinUserHashId: string,
  ): Promise<LinkedinUser | undefined> {
    return await this.linekdinUserRepository.findOne({
      where: { hash_id: linkedinUserHashId },
    });
  }

  async findOneByMemberId(memberId: string): Promise<LinkedinUser | undefined> {
    return await this.linekdinUserRepository.findOne({
      where: { member_id: memberId },
    });
  }
}

function sqlBoolToJS(value: string) {
  if (value === 'TRUE') return true;
  if (value === 'FALSE') return false;
  return false;
}

function pasrseIntIfExists(value: string): number | null {
  if (!value) {
    return null;
  }
  return parseInt(value);
}
