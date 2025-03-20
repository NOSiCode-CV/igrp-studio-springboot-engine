const axios = require('axios');
const fs = require('fs');
const path = require('path');
const {
  SPRING_INITIALIZER_DEPENDENCIES_DATA_URL,
  SPRING_BOOT_VERSION,
  SPRING_LOCAL_DEPENDENCY_FILE_DATA,
} = require('@/helper/springInitializerHelper');

const fetchDataAndSaveToFile = async () => {
  try {
    const response = await axios.get(
      `${SPRING_INITIALIZER_DEPENDENCIES_DATA_URL}${SPRING_BOOT_VERSION}`,
    );

    const data = response.data;

    const filePath = path.join(__dirname, `${SPRING_LOCAL_DEPENDENCY_FILE_DATA}`);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

    console.log(`Response data saved to ${filePath}`);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

fetchDataAndSaveToFile();
