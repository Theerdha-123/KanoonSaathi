import 'dotenv/config';

async function listModels() {
  try {
    const res = await fetch('https://integrate.api.nvidia.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    if (data.data) {
      console.log('Available Llama models:');
      data.data.filter(m => m.id.includes('llama')).forEach(m => console.log(m.id));
    } else {
      console.log('Error:', data);
    }
  } catch (e) {
    console.error(e);
  }
}

listModels();
