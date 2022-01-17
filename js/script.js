jQuery(document).ready(function ($) {

  var BASE_URL = "https://soutenir.pasteur.fr/enquete-transmission-patrimoine/";

  $('.je-teste').on('click', function(event){
    if(ValidateInfos()){
      event.preventDefault();
      $('.text2').show();
    }else{
      $('.text2').hide();
      $('.je-teste-bis').click();
    }
  })
  /* quiz */
  var score = 0;
  $(".page-quiz fieldset ul li input").change(function (event) {
    if ($(this).attr("id") == "q0r1") {
      // ValidateInfos();
      $.ajax({
        type: "POST",
        cache: false,
        url: BASE_URL + "actions/quiz_hits.php",
        dataType: "json",
        data: {
          meta: "enter_quiz",
        },
      });
      dataLayer.push({
        event: "QuizzStart",
      });
    }

    if ($(this).parents().hasClass("question-5")) {
      dataLayer.push({
        event: "QuizzCompleted",
      });
      submitRespenses();
    }

    $(this).parents(".page-quiz").removeClass("home-bg");
    $(this).closest("li").removeClass("active");
    if ($(this).is(":checked")) {
      $(this).closest("li").addClass("active");
      $(this).closest("li").siblings().removeClass("active");
      $(this).closest("fieldset").addClass("replied");
      if ($(this).closest("li").hasClass("ac")) {
        score++;
      } else {
        if (
          $(this).closest("fieldset").hasClass("replied") &&
          $(this).closest("li").hasClass("ac active")
        ) {
          score--;
        }
      }
      $(this).closest("fieldset").removeClass("active").addClass("ok");
      $(this).closest("fieldset").next().removeClass("ok").addClass("active");
      $("html, body").animate(
        {
          scrollTop: 0,
        },
        "fast"
      );
      if ($(this).closest("fieldset").next().is(":last-child")) {
        $(this).closest("fieldset").parents("body").addClass("result-page");
      }
      event.preventDefault();
      $(this)
        .parents("body")
        .find(".side-menu li.active")
        .removeClass("active")
        .addClass("ok")
        .next()
        .addClass("active ok");
      if (score == 5) {
        $(this)
          .parents(".page-quiz")
          .find(".result .question")
          .html("5 BONNES RÉPONSES SUR 5, BRAVO !");
      } else if (score < 2) {
        $(this)
          .parents(".page-quiz")
          .find(".result .question")
          .html(score + " BONNE RÉPONSE SUR 5");
      } else {
        $(this)
          .parents(".page-quiz")
          .find(".result .question")
          .html(score + " BONNES RÉPONSES SUR 5");
      }

      if (score == 5) {
        $(".results-text2").html("Des informations complémentaires à l'enquête vont vous être envoyées par e-mail.");
        $(".results-text").html(
          "En effet, les sujets du legs, de la donation et de l'assurance-vie méritent d'être approfondis. Découvrez-en plus sur les démarches qui encadrent la transmission de patrimoine."
        );
      /*} else if (score <= 3) {
        $(".results-text").html(
          "Les sujets du legs, de la donation et de <br>l’assurance-vie sont encore un peu <br>nouveaux pour vous, et vous ne connaissez <br>peut-être pas toutes les démarches <br>qui encadrent la transmission."
        );*/
      } else {
        $(".results-text2").html("Les réponses à l'enquête vont vous être envoyées par e-mail.");
        $(".results-text").html(
          "Les sujets du legs, de la donation et de l'assurance-vie sont encore un peu nouveaux pour vous, et vous ne connaissez peut-être pas toutes les démarches qui encadrent la transmission."
        );
      }
    }
  });

  $(".page-quiz .side-menu a").click(function () {
    if (!$(this).closest("li").hasClass("active")) {
      var name = $(this).attr("name");
      $(this).parents(".page-quiz").removeClass("result-page");
      if ($(this).closest("li").hasClass("ok")) {
        $(this).closest("li").addClass("active");
        $(this).closest("li").siblings().removeClass("active");
        $(this).parents(".page-quiz").find("fieldset").removeClass("active");
        if ($(this).parents(".page-quiz").find("fieldset").hasClass("ok")) {
          $(this)
            .parents(".page-quiz")
            .find('[id="' + name + '"]')
            .removeClass("ok")
            .addClass("active");
        }
      }
    }
  });

  function ValidateInfos(){
    var erreur = false;
    var $pageQuiz = $(".page-quiz"),
        $form = $pageQuiz.find("form.slide"),
        $civilite = $form.find('input[name="civilite"]'),
        $nom = $form.find('input[name="nom"]'),
        $prenom = $form.find('input[name="prenom"]'),
        $email = $form.find('input[name="email"]');

    if($civilite.is(':checked')){
      $civilite.parent().parent().removeClass('erreur');
      erreur_civ = false; 
    }else{     
      $civilite.parent().parent().addClass('erreur');
      erreur_civ = true;
    }
    if ($prenom.val() != "" && $prenom.val().length < 2) {
      $prenom.addClass('erreur');
      erreur_pre = true;
    }else{
      $prenom.removeClass('erreur');
      erreur_pre = false;
    }
    // var nom = $nom.val();
    if ($nom.val() == "" || $nom.val().length < 2) {
      $nom.addClass('erreur');
      erreur_nom = true;
    }else{
      $nom.removeClass('erreur');
      erreur_nom = false;
    }

    var email = $email.val(),
      validEmail = /^(([^éèçàëêôöîïûÉÈÇÀËÊÔÖÎÏÛ<>()\[\]\\.,;:\s@"]+(\.[^éèçàëêôöîïûÉÈÇÀËÊÔÖÎÏÛ<>()\[\]\\.,;:\s@é"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    var userID = email.split('@');
    if (!validEmail || userID[0].length < 2) {
      $email.addClass('erreur');
      erreur_em = true;
      if(!erreur_civ && !erreur_nom){
        $('.text2').html("Il semble que votre adresse e-mail soit incomplète ou erronée. <br>Merci de vérifier pour vous transmettre les réponses");
      }else{
        $('.text2').html("Merci de bien vouloir compléter tous les champs du formulaire.");
      }      
    }else{
      $('.text2').html("Merci de bien vouloir compléter tous les champs du formulaire.");
      $email.removeClass('erreur');
      erreur_em = false;
    }
    if(erreur_civ || erreur_nom || erreur_em || erreur_pre){
      erreur = true;
    }
    return erreur;
  }
  function submitRespenses(){
    var $pageQuiz = $(".page-quiz"),
        $form = $pageQuiz.find("form.slide"),
        $email = $form.find('input[name="email"]');
    var email = $email.val(),
      validEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        email);

    if (!validEmail) {
      $(".err-msgs").html(
        "Il semble que votre adresse e-mail soit incomplète ou erronée. <br>Merci de vérifier pour vous transmettre les réponses"
      );
      $(".greeting-msgs").empty();
    } else {
      $.ajax({
        type: "POST",
        cache: false,
        url: BASE_URL + "actions/quiz_submit.php",
        dataType: "json",
        data: $form.serialize(),
      }).done(function (response) {
        if (response.success) {
          $(".result").html(
            '<script type="text/javascript"> \
              /* <![CDATA[ */ \
              var google_conversion_id = 975695583; \
              var google_conversion_label = "pBOBCJrUl4YBEN_dn9ED"; \
              var google_remarketing_only = false; \
              /* ]]> */ \
              </script> \
              <script type="text/javascript" src="//www.googleadservices.com/pagead/conversion.js"> \
              </script> \
              <noscript> \
              <div style="display:inline;"> \
              <img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/975695583/?label=pBOBCJrUl4YBEN_dn9ED&amp;guid=ON&amp;script=0"/> \
              </div> \
              </noscript> \
              <h4>Merci beaucoup pour votre participation&nbsp;! <br>Un e-mail vous a été envoyé avec les réponses du test&nbsp;!</h4>'
          );
          $(".err-msgs").empty();
          //window.location.reload();
          fbq("track", "Lead");

          ValiderReponses();
        } else {
          $(".result").html("Il semble que votre adresse e-mail soit incomplète ou erronée. <br>Merci de vérifier pour vous transmettre les réponses");
          $("body").addClass("last-page");
          $(".err-msgs").empty();
        }
      });
    }
  }

  function ValiderReponses() {
    $.ajax({
      url: " https://ediis.emsecure.net/contentrenderer/Body.aspx", // toujours vrai
      data: {
        ID:
          "Ji6JRgSLGmlcXLdeYcEiiQ%2BPKOpmBc4SFNMarum_S2binItRS45w9pj0mxriflGyeByx0Zi0aC", //en fonction de l'appel au serveur, différent à chaque fois : ICI Déjà LE BON ID !
        MAIL: $email.val(),
        Q1: $("input[type=radio][name=q1]:checked").val(),
        Q2: $("input[type=radio][name=q2]:checked").val(),
        Q3: $("input[type=radio][name=q3]:checked").val(),
        Q4: $("input[type=radio][name=q4]:checked").val(),
        Q5: $("input[type=radio][name=q5]:checked").val(),
      },
      method: "GET", // obligatoire pour réutiliser les paramètres
      async: false, // idem
    }).done(function (data) {});
  }

  
  // Cookies
  /*
  window.addEventListener("load", function () {
    window.cookieconsent.initialise({
      palette: {
        popup: {
          background: "#db8169",
        },
        button: {
          background: "#ffffff",
        },
      },
      content: {
        message:
          "En poursuivant votre navigation sur ce site, vous acceptez l’utilisation de cookies destinés à réaliser des statistiques de visites et améliorer votre performance sur ce site.",
        dismiss: "OK, j’ai compris",
        link: "Plus d’information",
        href:
          "https://www.pasteur.fr/fr/mentions-legales#5-traitements-de-donnes-personnelles",
      },
    });
  });*/
  //code validation
  function inputsTest(id) {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    $(id).click(function () {
      if (
        ($("#mme").val() === "" && $("#mr").val() === "") ||
        $("#nom1").val() === "" ||
        $("#prenom1").val() === "" ||
        $("#email1").val() === "" ||
        testEmail.test($("#email1").val()) === false ||
        ($("#mme").is(":checked") === false &&
          $("#mr").is(":checked") === false)
      ) {
        $(".text2").addClass("active");
      } else {
        $(".text2").removeClass("active");
      }
    });
  }
  inputsTest("#testbtn");
});


function validateKeyStrokes(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 32 && charCode < 65) || (charCode > 90 && charCode < 97) || (charCode > 122 && charCode < 192)) {
        return false;
    }
    return true;
}
