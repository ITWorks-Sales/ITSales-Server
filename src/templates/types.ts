type fieldType = 'string' | 'number' | 'bool';

type field = { key: string; value: string; type: fieldType };

type templateType = 'Inmail' | 'Message';

type TemplatesFilters = {
  currentUserOnly: boolean;
  templateType: templateType;
};

export { field, templateType, fieldType, TemplatesFilters };
