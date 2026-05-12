const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testUpload() {
  try {
    console.log('Step 1: Creating customer...');
    
    // Create customer first
    const customerResponse = await axios.post('http://localhost:5000/api/customers', {
      name: 'Test Customer',
      email: 'test@example.com'
    });
    
    console.log('Customer created:', customerResponse.data);
    const customerId = customerResponse.data.id;
    
    console.log('Step 2: Uploading file...');
    
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream('sample.txt'));
    form.append('customerId', customerId);
    form.append('customerName', 'Test Customer');

    // Send request
    const response = await axios.post('http://localhost:5000/api/upload', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log('Upload successful:', response.data);
    
    console.log('Step 3: Testing download...');
    
    // Test download
    const downloadResponse = await axios.get(`http://localhost:5000/api/files/${response.data.id}/download`, {
      responseType: 'blob'
    });
    
    console.log('File downloaded successfully, size:', downloadResponse.data.length, 'bytes');
    
    // Test getting all files for admin
    const filesResponse = await axios.get('http://localhost:5000/api/files');
    console.log('All files for admin:', filesResponse.data);
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testUpload();
