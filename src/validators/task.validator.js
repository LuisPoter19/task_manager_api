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

function validateStatusTransition(currentStatus, newStatus) {
    const pendingStatus = ["in_progress", "completed"]
    const inProgressStatus = ["completed"]
    const incompleteStatus = ["in_progress", "completed"]

    if (currentStatus === "completed") {
        return false
    }

    if (currentStatus === "pending") {       
        if (pendingStatus.includes(newStatus)) {
            return true
       }
    }

    if (currentStatus === "in_progress") {      
        if (inProgressStatus.includes(newStatus)) {
            return true
        }
    }

     if (currentStatus === "incomplete") {      
        if (incompleteStatus.includes(newStatus)) {
            return true
        }
    }

    return false
}

module.exports = { validateName, validateDescription, validatePriority, validateStatus, validateDurationDays, validateStatusTransition }

