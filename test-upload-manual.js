const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testManualUpload() {
  try {
    console.log('Step 1: Creating customer...');
    
    // Create customer first
    const customerResponse = await axios.post('http://localhost:5000/api/customers', {
      name: 'Manual Test Customer',
      email: 'manual@example.com'
    });
    
    console.log('Customer created:', customerResponse.data);
    const customerId = customerResponse.data.id;
    
    console.log('Step 2: Uploading file...');
    
    // Create form data with a simple text file
    const form = new FormData();
    
    // Create a simple test file content and write to temp file
    const testContent = 'This is a test file for manual upload testing.\nCreated at: ' + new Date().toISOString();
    const tempFilePath = 'temp-test.txt';
    fs.writeFileSync(tempFilePath, testContent);
    
    form.append('file', fs.createReadStream(tempFilePath), {
      filename: 'manual-test.txt',
      contentType: 'text/plain'
    });
    form.append('customerId', customerId);
    form.append('customerName', 'Manual Test Customer');

    // Send request
    const response = await axios.post('http://localhost:5000/api/upload', form, {
      headers: {
        ...form.getHeaders()
      }
    });

    console.log('Upload successful:', response.data);
    
    // Clean up temp file
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    
  } catch (error) {
    console.error('Manual test failed:', error.response?.data || error.message);
  }
}

testManualUpload();
