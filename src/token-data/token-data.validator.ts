import ValidationResult from 'src/utils/interface/validation-result.interface';

export function tokenParamsValidator(payload: any): ValidationResult {
  const validationResult: ValidationResult = {
    status: true,
    message: 'Token params validation successful',
  };

  if (!payload.userId) {
    validationResult.status = false;
    validationResult.message =
      'User information is mandatory to fetch the access key info';
    return validationResult;
  }

  if (!payload.accessKey) {
    validationResult.status = false;
    validationResult.message =
      'Access key is mandatory to fetch the token data';
    return validationResult;
  }

  return validationResult;
}
