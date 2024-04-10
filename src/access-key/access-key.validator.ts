import ValidationResult from 'src/utils/interface/validation-result.interface';

export function accessKeyValidator(payload: any): ValidationResult {
  const validationResult: ValidationResult = {
    status: true,
    message: 'Payload validation successfull',
  };

  if (!payload.userId) {
    validationResult.status = false;
    validationResult.message =
      'User information is mandatory to create a access key';
    return validationResult;
  }

  if (!payload.rateLimit) {
    validationResult.status = false;
    validationResult.message =
      'Proper rate limits have to be defined By the Admins for access keys';
    return validationResult;
  }

  if (!payload.expirationTime) {
    validationResult.status = false;
    validationResult.message =
      'Proper rate limits have to be defined By the Admins for access keys';
    return validationResult;
  }

  return validationResult;
}
