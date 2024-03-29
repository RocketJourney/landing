$(function() {
  $('#role_select').change(function () {
    var val = $(this).val();
    if (val != "member") {
      $('#location_count').show(200);
      $('#software_brand').show(200);
    } else {
      $('#location_count').hide(200);
      $('#software_brand').hide(200);
    };
  });

  $("form[name='signup']").validate({

    rules: {
      club_name: "required",
      first_name: "required",
      last_name: "required",
      email: {
        required: true,
        email: true
      },
      role: "required"
    },

    messages: {
      club_name: "Please enter your Club's name",
      first_name: "Please enter your first name",
      last_name: "Please enter your last name",
      email: "Please enter a valid email address",
      role: "Please select your role"
    },

    submitHandler: function(form) {
      let club_name = $("#club_name_input").val();
      let first_name = $("#first_name_input").val();
      let last_name = $("#last_name_input").val();
      let email = $("#email_input").val();
      let role = $("#role_select").val();
      let location_count = $("#location_count_input").val();
      let software_brand = $("#software_brand_input").val();

      sendLeadForm(club_name, first_name, last_name, email, role, location_count, software_brand);

    }
  });
});

var sendLeadForm = (club_name, first_name, last_name, email, role, location_count, software_brand) => {
  // Put loading state
  $("#signup_form :input").prop("disabled", true);
  $("#signup_form").addClass("_state-loading");
  $("#rj-send").addClass("hidden");
  $("#loading-placeholder").removeClass("hidden");

  // Make Request to API & render result states

  $.ajax({
    type: 'POST',
    url: `https://rocket-api.com/api/v1/leads`,
    dataType: 'json',
    data: {
      "lead": {
        "club_name": club_name,
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "role": role,
        "location_count": location_count,
        "access_control": software_brand
      }
    },
    success: function (data) {
      console.log("success:", data);
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
