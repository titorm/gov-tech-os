import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('get() should return { status: "ok" }', () => {
    const controller = new HealthController();
    expect(controller.get()).toEqual({ status: 'ok' });
  });
});
