angular.module('pokeapiApp').factory("DomServ", function () {

    const TIMEOUT_SCROLL = 1000;

    /**
     * Funcion para regresar a inicio de página
     */
    var service = {};
    service.toTop = function (scroll) {
        scroll = typeof scroll === typeof undefined ? 0 : scroll;
        $('html, body').animate({scrollTop: scroll}, TIMEOUT_SCROLL);
    };

    /**
     * Función para ir a una alerta.
     * @param selector
     */
    service.toElement = function (selector) {
        $("html, body").animate({scrollTop: $(selector).offset().top - 300}, TIMEOUT_SCROLL);
    };

    service.loadTooltip = function (placement) {
        $('[data-toggle="tooltip"]').tooltip({placement: placement});
    };

    /**
     * Cambiar el tab en el diseño interno.
     * @param way "next" | "prev"
     * @param selector
     */
    service.changeTab = function (way, selector) {
        var selectedLi = $(selector);
        var selectedTab = $(".tab-content > .tab-pane.active:first");


        if (way === "next" && selectedTab.next().length > 0) {

            selectedLi.next().addClass("active");
            selectedTab.next().addClass("active in");

            selectedLi.removeClass("active");
            selectedTab.removeClass("active in");

        } else if (way === "prev" && selectedTab.prev().length > 0) {

            selectedLi.prev().addClass("active");
            selectedTab.prev().addClass("active in");

            selectedLi.removeClass("active");
            selectedTab.removeClass("active in");

        }
    };

    /**
     * Funcion para encontrar la siguiente clase a[data-toggle="tab"] y selecionarla en extensive
     * @param elem
     */
    service.nextTabEx = function (elem) {
        $(elem).next().find('a[data-toggle="tab"]').click();
        var $active = $('ul.wizard-steps-extensive li.active');
        $active.removeClass("active");
        $active.addClass("activeWizard");
        $active.prev().removeClass("activeWizard");
    }
    /**
     * Funcion para encontrar la anterior clase a[data-toggle="tab"] y selecionarla en extensive
     * @param elem
     */
    service.beforeTabEx = function (elem) {
        $(elem).prev().find('a[data-toggle="tab"]').click();
        var $active = $('ul.wizard-steps-extensive li.active');
        $active.removeClass("active");
        $active.addClass("activeWizard");
        $active.next().removeClass("activeWizard");
    }
    /**
     * Funcion para encontrar la siguiente clase a[data-toggle="tab"] y selecionarla en validacion parametrico
     * @param elem
     */
    service.nextTabValPar = function (elem) {
        $(elem).next().find('a[data-toggle="tab"]').click();
        var $active = $('ul.nav nav-tabs li.active');
        $active.removeClass("active");
    }
    /**
     * Funcion para encontrar la anterior clase a[data-toggle="tab"] y selecionarla en validacion parametrico
     * @param elem
     */
    service.beforeTabValPa = function (elem) {
        $(elem).prev().find('a[data-toggle="tab"]').click();
        var $active = $('ul.nav nav-tabs li.active');
        $active.addClass("active");
        $active.next().removeClass("active");
    }
    /**
     * Funcion para encontrar la siguiente clase a[data-toggle="tab"] y selecionarla
     * @param elem
     */
    service.nextTab = function (elem) {
        $(elem).next().find('a[data-toggle="tab"]').click();
        var $active = $('ul.wizard-steps li.active');
        $active.removeClass("active");
        $active.addClass("activeWizard");
        $active.prev().removeClass("activeWizard");
    }
    /**
     * Funcion para encontrar la anterior clase a[data-toggle="tab"] y selecionarla
     * @param elem
     */
    service.beforeTab = function (elem) {
        $(elem).prev().find('a[data-toggle="tab"]').click();
        var $active = $('ul.wizard-steps li.active');
        $active.removeClass("active");
        $active.addClass("activeWizard");
        $active.next().removeClass("activeWizard");
    };

    service.enterAddTable = function (elem) {
        $(elem).next().find('button[class="btn-primary"]').css({color: "blue"})
    };

    service.loadDataFake = function (timeout) {
        if (timeout === undefined) timeout = 0;
        setTimeout(function () {
            $("input[id*='Fake']").each(function (index, element) {
                const value = $(element).prev().val();
                const isDisabled = $(element).prev().prop('disabled');
                if (isDisabled) $(element).attr('disabled', 'disabled');

                if (value === "") {
                    $(element).val(0);
                    $(element).prev().val(0);
                    $(element).prev().trigger("change");  //este se le puede quitar para forsar al usuario a pasar por todos los campos.
                } else {
                    $(element).val(self.insertComa(value));
                    $(element).trigger("change");
                    $(element).trigger("focusout");
                }
            });
        }, timeout);
    };

    service.loadDataFakeByIdInput = function (idElement) {
        let element = $("#" + idElement + "Fake");
        const value = $(element).prev().val();
        const isDisabled = $(element).prev().prop('disabled');
        if (isDisabled) $(element).attr('disabled', 'disabled');

        if (value === "") {
            $(element).val(0);
            $(element).prev().val(0);
            $(element).prev().trigger("change");  //este se le puede quitar para forsar al usuario a pasar por todos los campos.
        } else {
            $(element).val(self.insertComa(value));
            $(element).trigger("change");
            $(element).trigger("focusout");
        }
    };
    /**
     * Inserta las comas de miles a un input
     * @param number
     */
    self.insertComa = function (number) {
        //quita las comas que anteriormente fueron insertadas
        number = number.replace(/,/g, '');
        var negative;

        //quita el signo negativo para poder trabajar con solo el numero a ingresar las comas
        if (number.length > 1 && number[0] === "-") {
            negative = "-";
            number = number.replace(/-/g, '');
        } else {
            negative = "";
        }
        let varWithComma = "";
        let contador = 1;
        let aux = "";
        let array = number.split(".");
        let num = array[0];
        if (num.length > 3) {
            for (var i = num.length; i > 0; i--) {
                if (contador === 3 && i !== (1)) {
                    varWithComma = varWithComma + num[i - 1] + ",";
                    contador = 0;
                } else
                    varWithComma = varWithComma + num[i - 1];
                contador++;
            }
        } else {
            return negative + number;
        }
        for (i = varWithComma.length - 1; i >= 0; i--) aux = aux + varWithComma[i];

        return array.length > 1 ? negative + aux + "." + array[1] : negative + aux;
    };

    service.removeClassError = function (idElement) {
        $("#" + idElement).removeClass("highlight-error");
        $("span[data-target='" + idElement + "']").attr("class", "hidden");
        $("span[data-asterisk='" + idElement + "']").removeClass("text-danger");
    };

    service.addClassError = function (idElement) {
        $("#" + idElement).addClass("highlight-error");
        $("span[data-asterisk='" + idElement + "']").attr("class", "text-danger");
        $("span[data-target='" + idElement + "']").attr("class", "text-danger");
        $("span[data-target='" + idElement + "']").text("El campo es requerido.");
    };

    service.computeLetra = function (num) {
        var result = "";
        if (typeof num !== typeof undefined && num !== null) {
            if (num.constructor === Number) {
                // console.log("NumeroALetras("+num+"): " + NumeroALetras(num));
                result = NumeroALetras(num);
            }
        }
        return result;
    };

    return service;
});