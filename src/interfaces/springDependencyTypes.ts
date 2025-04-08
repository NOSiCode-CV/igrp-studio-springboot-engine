export interface Dependency {
  name: string;
  groupId: string;
  artifactId: string;
  scope: string;
  version?: string;
  bom?: string;
}

export interface SpringInitializerData {
  bootVersion: string;
  dependencies: {
    [key: string]: {
      groupId: string;
      artifactId: string;
      scope: string;
      version?: string;
      bom?: string;
    };
  };
  repositories: any;
  boms: {
    [key: string]: {
      groupId: string;
      artifactId: string;
      version: string;
    };
  };
}
