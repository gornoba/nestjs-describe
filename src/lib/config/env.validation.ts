import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  ENV: Joi.string().valid('development', 'production').required(),
  PORT: Joi.number().required().default(3000),
  CORS_ORIGIN: Joi.string().required().default('*'),
  DEFAULT_SRC: Joi.string().required(),
  SCRIPT_SRC: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  SWAGGER_AUTH: Joi.string().custom((value) =>
    joiCustom(value, ['user', 'password']),
  ),
  JWT_SECRET: Joi.string().required(),
  REDIS: Joi.string().custom((value) => joiCustom(value, ['host', 'port'])),
  POSTGRE: Joi.string().custom((value) =>
    joiCustom(value, [
      'host',
      'port',
      'username',
      'password',
      'database',
      'schema',
    ]),
  ),
  MONGO: Joi.string().custom((value) =>
    joiCustom(value, [
      'host',
      'port',
      'username',
      'password',
      'database',
      'authSource',
    ]),
  ),
});

function joiCustom<V = any>(value: V, objKeys: string[]) {
  try {
    const config = JSON.parse(String(value));

    const joyObj = {};
    objKeys.forEach((key) => {
      if (key === 'port') {
        joyObj[key] = Joi.number().required();
      } else {
        joyObj[key] = Joi.string().required();
      }
    });

    const configSchema = Joi.object(joyObj);
    const { error } = configSchema.validate(config);
    if (error) throw new Error(error.message);
  } catch (error) {
    throw new Joi.ValidationError(error.message, [error.details], value);
  }
}
