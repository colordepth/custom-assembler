import axios from 'axios'

const baseUrl = '/api/assembler'

const sendCode = code => {

	const request = axios.post(baseUrl, {code})
	return request.then(response => response.data)
}

const promises = {sendCode}

export default promises
