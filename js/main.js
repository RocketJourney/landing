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

$(function() {
  $("form[name='signup-extra']").validate({

    rules: {
      location_count: {
        required: false,
        digits: true
      }
    },

    messages: {
      location_count: "Please enter only digits",
    },

    submitHandler: function(form) {
      let website = $("#website").val();
      let softwareBrand = $("#software_brand").val();
      var locationCount = $("#location_count").val();

      sendLeadAdditionalForm(website, softwareBrand, locationCount);
    }
  });
});

function getLanguageCode() {
  const language = (window.navigator.languages && window.navigator.languages[0]) ||
        window.navigator.language ||
        window.navigator.userLanguage;
  return language.toLowerCase().split(/[_-]+/)[0];
}

function sendLeadAdditionalForm(website, softwareBrand, locationCount) {
  $("#signup_form_extra :input").prop("disabled", true);
  $("#signup_form_extra").addClass("_state-loading");
  $("#rj-sen-extra").addClass("hidden");
  $("#loading-placeholder-extra").removeClass("hidden");
  let id = sessionStorage.getItem('lead_id')
  let data = { "lead": {} };

  if (website.length > 0) {
    data["lead"]["website"] = website;
  }
  if (softwareBrand.length > 0) {
    data["lead"]["software_brand"] = softwareBrand;
  }
  if (locationCount.length > 0) {
    data["lead"]["location_count"] = locationCount;
  }


  // Make Request to API & render result states

  $.ajax({
    type: 'PATCH',
    url: 'https://api.testin.space/api/v1/clubs/leads/' + id,
    dataType: 'json',
    data: data,
    success: function (data) {
      $('body').css('overflow','hidden');
      $('#extra-signup-form').modal('hide');
      $("#signup_form_extra :input").prop("disabled", false);
      $("#signup_form_extra").removeClass("_state-loading");
      $("#rj-send-extra").removeClass("hidden");
      $("#loading-placeholder-extra").addClass("hidden");
      $('#signup-form-success').modal({
        backdrop: 'static',
        keyboard: false
      });
    },
    error: function () {
      console.log("error");
      $("#signup_form_extra :input").prop("disabled", false);
      $("#signup_form_extra").removeClass("_state-loading");
      $("#rj-send-extra").removeClass("hidden");
      $("#loading-placeholder-extra").addClass("hidden");
      $("#form-error-msg-extra").removeClass("hidden");
    }
  });
}

function sendLeadForm(club_name, name, email, phone) {
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
    data["lead"]["phone"] = phone;
    data["lead"]["country"] = phoneData.iso2;
    data["lead"]["lada"] = phoneData.dialCode;
  }

  // Make Request to API & render result states

  $.ajax({
    type: 'POST',
    url: `https://api.testin.space/api/v1/clubs/leads`,
    dataType: 'json',
    data: data,
    success: function (data) {
      console.log("success:", data);
      sessionStorage.setItem('lead_id', data.data.id)
      $('body').css('overflow','hidden');
      $('#signup-form').modal('hide');
      $("#signup_form :input").prop("disabled", false);
      $("#signup_form").removeClass("_state-loading");
      $("#rj-send").removeClass("hidden");
      $("#loading-placeholder").addClass("hidden");
      $("#extra-signup-form").modal();
      // if (role != "member") {
      //   $('#signup-form-success').modal({
      //     backdrop: 'static',
      //     keyboard: false
      //   });
      // } else {
      //   $('#signup-form-member-msg').modal();
      // }
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
