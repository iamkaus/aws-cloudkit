import { config } from 'dotenv'
import path from 'node:path';

const env = process.env.NODE_ENV || 'development';

/**
 * Loads environment variables from the environment-specific
 * local configuration file.
 *
 * Resolves the path relative to this configuration file so that
 * the environment file can be loaded regardless of the current
 * working directory.
 */

config({
    path: path.resolve(
        import.meta.dirname,
        `../.env.${env}.local`,
    ),
});

const requireENV = (name: string): string => {
    const value = process.env[name]

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

export const AWS_USER_ACCESS_KEY = requireENV('AWS_USER_ACCESS_KEY')
export const AWS_USER_SECRET_KEY = requireENV('AWS_USER_SECRET_KEY')
export const AWS_REGION          = requireENV('AWS_REGION')
export const AWS_PROFILE         = requireENV('AWS_PROFILE')
export const AWS_TEST_BUCKET     = requireENV('AWS_TEST_BUCKET')
export const AWS_TEST_QUEUE      = requireENV('AWS_TEST_QUEUE')
export const AWS_TEST_FUNCTION   = requireENV('AWS_TEST_FUNCTION')

// DEBUG

console.log('ACCESS:', process.env.AWS_USER_ACCESS_KEY);
console.log('SECRET:', process.env.AWS_USER_SECRET_KEY);
console.log('REGION:', process.env.AWS_REGION);
console.log('PROFILE:', process.env.AWS_PROFILE);
console.log('BUCKET:', process.env.AWS_TEST_BUCKET);
console.log('QUEUE:', process.env.AWS_TEST_QUEUE);
console.log('FUNCTION:', process.env.AWS_TEST_FUNCTION);