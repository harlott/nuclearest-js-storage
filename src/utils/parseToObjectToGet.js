const parseToObjectToGet = (value) => {
    let parsedValue
    try {
        parsedValue = JSON.parse(value)
    } catch (err) {
        if (err instanceof SyntaxError){
            return value
        } else {
            throw err
        }
    }
    return parsedValue
}

export default parseToObjectToGet
