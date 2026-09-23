function validateName(name, required = false) {

    if (name === undefined) {
        return !required

    }

    if (typeof name !== "string") {
        return false

    }

    const cleanName = name.trim()    

    if (cleanName.length <3 || cleanName.length > 100) {
        return false

    }

    return true

}

function validateDescription(description, required = false) {

    if (description === undefined) {      
        return !required
    }

    if (typeof description !== "string") {
        return false

    }

    const cleanDescription = description.trim()

    if (cleanDescription.length < 5 || cleanDescription.length > 255) {
        return false

    }

    return true
}

function validateDurationDays(duration_days, required = false) {

    if (duration_days === undefined) {
        return !required

    }

    if (typeof duration_days !== "number" || !Number.isInteger(duration_days) || duration_days <= 0) {
        return false

    }

    return true
}

function validatePriority(priority, required = false) {

    const validPriorities = ['low', 'medium', 'high']

    if (priority === undefined) {
        return !required

    }

    if (!validPriorities.includes(priority)) {
        return false

    }

    return true
}

function validateStatus(status) {
    const validStatus = ["pending", "in_progress", "completed", "incomplete"]

    if (status === undefined) {
        return true

    }

    if (!validStatus.includes(status)) {
        return false

    }

    return true

}

module.exports = { validateName, validateDescription, validatePriority, validateStatus, validateDurationDays }

console.log(validateName("Tarea de Node"))
console.log(validateName("ab"))
console.log(validateName(undefined, true))

console.log(validateDescription("Practicar Express"))
console.log(validateDescription("abc"))
console.log(validateDescription(undefined, true))

console.log(validateDurationDays(5, true))
console.log(validateDurationDays(0, true))
console.log(validateDurationDays(2.5, true))

console.log(validatePriority("high", true))
console.log(validatePriority("urgent", true))

console.log(validateStatus("completed"))
console.log(validateStatus("cancelled"))