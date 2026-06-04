export function validateRequired(...fields) {
    return fields.every(field => field && field.trim() !== '');
}

export function validateMinLength(value, min) {
    return value && value.length >= min;
}

export function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

export function validateRole(user, expectedRole) {
    return user && user.role === expectedRole;
}