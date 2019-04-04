import { ItemModule } from './item.module';

describe('AdminModule', () => {
  let itemModule: ItemModule;

  beforeEach(() => {
    itemModule = new ItemModule();
  });

  it('should create an instance', () => {
    expect(itemModule).toBeTruthy();
  });
});
