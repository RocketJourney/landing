$(function() {
  $("form[name='signup']").validate({

    rules: {
      club_name: "required",
      name: "required",
      email: {
        required: true,
        email: true
      },
    },

    messages: {
      club_name: "Please enter your Club's name",
      name: "Please enter your name",
      email: "Please enter a valid email address",
    },

    submitHandler: function(form) {
      let club_name = $("#club_name_input").val();
      let name = $("#name").val();
      let email = $("#email_input").val();
      var phone = $("#phone").intlTelInput("getNumber");

      sendLeadForm(club_name, name, email, phone);
    }
  });
});

function getLanguageCode() {
  const language = (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage;
  return language.toLowerCase().split(/[_-]+/)[0];
}

var sendLeadForm = (club_name, name, email, phone) => {
  // Put loading state
  $("#signup_form :input").prop("disabled", true);
  $("#signup_form").addClass("_state-loading");
  $("#rj-send").addClass("hidden");
  $("#loading-placeholder").removeClass("hidden");

  let data = {
    "lead": {
      "club_name": club_name, "name": name, "email": email, "browser_lang": getLanguageCode(),
    }
  };

  if (phone.length > 0) {
    var phoneData = $("#phone").intlTelInput("getSelectedCountryData");
    data["phone"] = phone;
    data["country"] = phoneData.iso2;
    data["lada"] = phoneData.dialCode;
  }

  // Make Request to API & render result states

  $.ajax({
    type: 'POST',
    url: `https://api.testin.space/api/v1/clubs/leads`,
    dataType: 'json',
    data: data,
    success: function (data) {
      // console.log("success:", data);
      $('body').css('overflow','hidden');
      $('#signup-form').modal('hide');
      $("#signup_form :input").prop("disabled", false);
      $("#signup_form").removeClass("_state-loading");
      $("#rj-send").removeClass("hidden");
      $("#loading-placeholder").addClass("hidden");
      if (role != "member") {
        $('#signup-form-success').modal({
          backdrop: 'static',
          keyboard: false
        });
      } else {
        $('#signup-form-member-msg').modal();
      }
    },
    error: function () {
      console.log("error");
      $("#signup_form :input").prop("disabled", false);
      $("#signup_form").removeClass("_state-loading");
      $("#rj-send").removeClass("hidden");
      $("#loading-placeholder").addClass("hidden");
      $("#form-error-msg").removeClass("hidden");
    }
  });
};
