"use strict";

const fetchData = async (data) => {
  try {
    const response = await fetch(data.url, {
      method: data.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.body),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("There was a problem with your fetch operation:", error);
    throw error;
  }
};

export default fetchData;
