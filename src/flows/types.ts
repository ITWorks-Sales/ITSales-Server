type nodeType = 'Inmail' | 'Queue';

type minMax = {
  min: number;
  max: number;
};

type usersType = 'success_users' | 'failed_users' | '';

type nodeDetails = {
  id: number;
  type: usersType;
  nodeType: nodeType;
};

export { nodeType, minMax, nodeDetails };
