import { AppsEngineException } from './AppsEngineException';

/**
 * The custom exceptions from apps
 *
 * It's used to display toasts to users that * a _known_
 * exception has happened during the execution of the apps.
 */
class ErrorToast extends AppsEngineException { }
export const Toast = {
    Error: ErrorToast,
};
