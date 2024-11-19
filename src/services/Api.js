const BASE_URL = import.meta.env.BASE_URL;
const CREATE_FORM = import.meta.env.CREATE_FORM;

export const Form_Creation = async (formPayload)=>
{
    try{
        const response = await fetch(`${BASE_URL}${CREATE_FORM}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formPayload),
          });
          if(!response.ok)
          {
            const errorDetails = await response.text(); // Capture server response
            console.error("Submission error:", errorDetails);
            throw new Error("Failed to submit the form: " + errorDetails);
          }
          return response;
    }
    catch(error)
    {
        console.log("Form Creation API call failed",error);
    }
}