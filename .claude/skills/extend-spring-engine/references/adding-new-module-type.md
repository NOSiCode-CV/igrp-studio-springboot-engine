## Adding a New Module Type

This reference covers scenarios where the new feature is a **module type** — meaning it generates multiple related files in a coordinated way, similar to how `addController` generates a controller + service interface + service implementation.

> For a single-file new operation, use [adding-new-operation.md](./adding-new-operation.md) instead.

---

### What is a "module type"?

A module type is a feature that generates **a family of related Java files** from a single config, with different files depending on the `projectStructureStyle`:

- `addController` → Controller + ServiceInterface + ServiceImpl (technical) OR Controller + Command/Query + Handler + HandlerTest (domain)
- `addModel` → Entity + Repository (technical) OR Entity + DomainRepository + RepositoryImpl + PersistenceRepository (domain)

---

### Multi-file generation pattern

The generation module uses a single entry function that calls multiple sub-generators:

```typescript
// src/modules/mymoduletype/generateMyModuleType.ts
export const generateMyModuleType = async (context: RenderContext<MyModuleTypeConfig>) => {
  const { baseConfig } = context;

  if (baseConfig.projectStructureStyle === PROJECT_STRUCTURE_STYLE.DOMAIN_DRIVEN_DESIGN) {
    await generateDomainFiles(context);
  } else {
    await generateTechnicalFiles(context);
  }

  // Config save is always done regardless of style
  await saveMyModuleTypeConfig(context.resourceConfig, context.basePath);
};

const generateTechnicalFiles = async (context: RenderContext<MyModuleTypeConfig>) => {
  // Generate file 1
  const file1 = await renderTemplate(TEMPLATES.MY_MODULE_TYPE_MAIN, context);
  await saveToFile(file1, resolveMainPath(context), !context.resourceConfig.readOnly);

  // Generate file 2
  const file2 = await renderTemplate(TEMPLATES.MY_MODULE_TYPE_SECONDARY, context);
  await saveToFile(file2, resolveSecondaryPath(context), !context.resourceConfig.readOnly);
};

const generateDomainFiles = async (context: RenderContext<MyModuleTypeConfig>) => {
  // Domain generates different files with different templates
  const domainFile = await renderTemplate(TEMPLATES.MY_MODULE_TYPE_DOMAIN, context);
  await saveToFile(domainFile, resolveDomainPath(context), !context.resourceConfig.readOnly);

  // DDD: also generate handler/test files
  const handlerFile = await renderTemplate(TEMPLATES.MY_MODULE_TYPE_HANDLER, context);
  await saveToFile(handlerFile, resolveHandlerPath(context), !context.resourceConfig.readOnly);
};
```

---

### Path resolver functions

Extract path resolution into private helper functions for clarity:

```typescript
const resolveMainPath = (context: RenderContext<MyModuleTypeConfig>): string => {
  const { fullPath, resourceConfig } = context;
  const name = capitalizeJavaStyle(resourceConfig.name);
  return path.join(fullPath, 'mymain', name + '.java');
};

const resolveDomainPath = (context: RenderContext<MyModuleTypeConfig>): string => {
  const { fullPath, resourceConfig } = context;
  const module = (resourceConfig.module ?? 'shared').toLowerCase();
  const name = capitalizeJavaStyle(resourceConfig.name);
  return path.join(fullPath, module, 'infrastructure', 'mymain', name + '.java');
};
```

---

### Multiple templates

Create one template per generated file type:

```
public/templates/
├── mymoduletype-main.hbs          ← primary class
├── mymoduletype-secondary.hbs     ← secondary class (e.g. interface)
├── mymoduletype-domain.hbs        ← domain-style primary class
└── mymoduletype-handler.hbs       ← domain-style handler
```

Register all of them in `TEMPLATES`:

```typescript
export const TEMPLATES = {
  MY_MODULE_TYPE_MAIN:      'mymoduletype-main.hbs',
  MY_MODULE_TYPE_SECONDARY: 'mymoduletype-secondary.hbs',
  MY_MODULE_TYPE_DOMAIN:    'mymoduletype-domain.hbs',
  MY_MODULE_TYPE_HANDLER:   'mymoduletype-handler.hbs',
};
```

---

### Extending the config for DDD-specific fields

DDD module types sometimes generate additional DDD-specific classes (commands, queries). In this case, use the actions/items array pattern from `ControllerConfig`:

```typescript
export interface MyModuleTypeConfig extends IdentifiableElement, VersionedConfig {
  type: 'myModuleType';
  name: string;
  module?: string;
  items: MyModuleTypeItem[];   // array drives the multi-file generation
}

export interface MyModuleTypeItem {
  name: string;
  category: 'read' | 'write';   // e.g. drives GET vs POST handler generation
  // ...
}
```

Loop over `items` in both the generator and the templates:

```typescript
// In generator:
for (const item of context.resourceConfig.items) {
  const itemContext = { ...context, currentItem: item };
  const rendered = await renderTemplate(TEMPLATES.MY_MODULE_TYPE_ITEM, itemContext);
  await saveToFile(rendered, resolveItemPath(context, item), true);
}
```

```handlebars
{{! In template: }}
{{#each resourceConfig.items}}
  // {{this.name}}
{{/each}}
```

---

### Test for multi-file modules

Verify all expected files are created:

```typescript
it('generates all expected files (technical style)', async () => {
  await addMyModuleType({ ... }, OUTPUT_DIR);

  const basePath = 'src/main/java/com/example/testapp';
  const expectedFiles = [
    path.join(OUTPUT_DIR, basePath, 'mymain', 'MyFeature.java'),
    path.join(OUTPUT_DIR, basePath, 'mymain', 'IMyFeature.java'),
  ];

  for (const file of expectedFiles) {
    expect(await fs.pathExists(file)).toBe(true);
  }
});

it('generates all expected files (domain style)', async () => {
  await addMyModuleType({ ..., module: 'users' }, DOMAIN_OUTPUT_DIR);

  const expectedFiles = [
    path.join(DOMAIN_OUTPUT_DIR, 'src/main/java/com/example/testapp/users/infrastructure/mymain/MyFeature.java'),
    // ... domain-specific files
  ];

  for (const file of expectedFiles) {
    expect(await fs.pathExists(file)).toBe(true);
  }
});
```

---

### Reference: how `addController` does it

Read `src/modules/controller/` to see the canonical multi-file module implementation:

- `generateController.ts` — controller class (branches on style)
- `generateServiceInterface.ts` — `IXxxService.java`
- `generateService.ts` — `XxxService.java`
- `generateRequest.ts` — request body class (when needed)
- `generateResponses.ts` — response class (when needed)

All called from `src/index.ts::addController()` in sequence.
