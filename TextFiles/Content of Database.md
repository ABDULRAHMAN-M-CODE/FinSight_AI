# Content of Database



### 1-User's information ,which is specified in the following JSON structure :



{

  "total\_household\_income": "number (float)",



  "income\_sources": \[

    {

      "income\_source": "string"

    }

  ],



  "monthly\_budget": "number (float)",



  "investment\_accounts": \[

    {

      "type": "string",

      "current\_balance": "number (float)"

    }

  ],



  "outstanding\_debts": \[

    {

      "type": "string",

      "balance": "number (float)",

      "monthly\_payment": "number (float)",

      "interest\_rate": "number (float, percentage)",

      "annual\_interest\_cost": "number (float)"

    }

  ],



  "life\_insurance": \[

    {

      "insurance\_type": "string",

      "death\_benefit": "number (float)",

      "cash\_value": "number (float)",

      "monthly\_premium": "number (float)",

      "has\_cash\_value": "boolean"

    }

  ],



  "financial\_goals": {

    "short\_term": "string",

    "long\_term": "string"

  }

}

---

### 2- Limited Financial Advice which is described in the following



 	{

  "limited\_advice": {

    "quick\_summary": {

      "monthly\_income": "number (float)",

      "monthly\_expenses": "number (float)",

      "savings\_rate": "number (float)",

      "savings\_call\_to\_action": "string"

    },

    "recommendations": \[

      {

        "id": "integer",

        "advice\_text": "string",

        "priority\_level": "string"

      }

    ],

    "projections": {

      "type": "string",

      "data\_points": \[

        {

          "month": "integer",

          "projected\_savings": "number (float)"

        }

      ]

    }

  }

}





### 3- Full Advice , which will contain the following info

