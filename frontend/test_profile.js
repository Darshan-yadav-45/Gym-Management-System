const axios = require('axios');

async function testPost() {
    try {
        // First login to get a token
        const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
            email: 'test1@example.com',
            password: 'password123'
        });
        
        const token = loginRes.data.token;
        console.log("Logged in, token:", token);

        // Now post to profile
        const profileRes = await axios.post('http://localhost:8080/api/profile', {
            age: 22,
            gender: 'Male',
            heightCm: 175,
            weightKg: 70,
            location: 'Bangalore',
            designation: 'Student',
            sports: ['Cricket', 'Volleyball', 'Kabaddi']
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Success:", profileRes.data);
    } catch (err) {
        console.error("Error:");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

testPost();
