function togglePaymentFields() {
      let method = document.getElementById("paymentMethod").value;

      document.getElementById("gcashFields").classList.add("hidden");
      document.getElementById("bankFields").classList.add("hidden");
      document.getElementById("paypalFields").classList.add("hidden");

      if (method === "gcash") {
        document.getElementById("gcashFields").classList.remove("hidden");
      } 
      else if (method === "bank") {
        document.getElementById("bankFields").classList.remove("hidden");
      } 
      else if (method === "paypal") {
        document.getElementById("paypalFields").classList.remove("hidden");
      }
    }
