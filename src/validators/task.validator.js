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

    return validPriorities.includes(priority)
}

function validateStatus(status) {
    const validStatus = ["pending", "in_progress", "completed", "incomplete"]

    if (status === undefined) {
        return true

    }

    return validStatus.includes(status)
}

function validateStatusTransition(currentStatus, newStatus) {
    const statusTransitions = {
        pending: ["in_progress", "completed"],
        in_progress: ["completed"],
        completed: [],
        incomplete: ["in_progress", "completed"]
    }

    if (!statusTransitions[currentStatus]) {
        return false
    }

    return statusTransitions[currentStatus].includes(newStatus)
        
}

module.exports = { validateName, validateDescription, validatePriority, validateStatus, validateDurationDays, validateStatusTransition }

