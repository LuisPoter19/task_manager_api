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

    cleanDescription = description.trim()

    if (cleanDescription.length < 5 || cleanDescription.length > 255) {

        return false

    }

    return true
}

function validateDurationDays(duration_days, required = false) {

    if (duration_days === undefined) {

        return !duration_days

    }

    if (typeof duration_days !== "number" || !Number.isInteger(duration_days) || duration_days <= 0) {

        return false

    }
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