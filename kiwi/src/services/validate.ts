const URL = 'http://localhost:2809';

export default async function validate(img: string): Promise<any> {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "country": "CO", "image": img })
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud');
    }

    const jsonResponse = await response.json();
    console.log(jsonResponse);
    return jsonResponse;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
