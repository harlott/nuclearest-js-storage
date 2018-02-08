import isObject from 'lodash/isObject'

const parseToStringToSet = (value) => {
    let parsedValue
    try {
        if (isObject(value)){
            parsedValue = JSON.stringify(value)
        } else {
            parsedValue = value
        }
        return parsedValue
    } catch(err) {
        throw err
    }
}

export default parseToStringToSet
