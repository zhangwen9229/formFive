// Generated by CoffeeScript 1.4.0
(function() {

  jQuery.fn.formFive = function(settings) {
    var autofocusInit, commonPresubmitCheckup, commonSetCaret, commonSubmitCheckup, config, formAlternativesChangeAttribute, formAlternativesInit, init, isSupported, placeholderCheckFocus, placeholderCheckValues, placeholderInit, placeholderReplaceWithType, placeholderSetValues, placeholderTextBoxes, targetForm,
      _this = this;
    config = {
      placeholder: false,
      placeholderClass: 'placeholder',
      autofocus: false,
      formaction: false,
      formenctype: false,
      formmethod: false,
      formtarget: false
    };
    if (settings) {
      jQuery.extend(config, settings);
    }
    targetForm = null;
    placeholderTextBoxes = null;
    init = function() {
      var formAlternatives;
      targetForm = jQuery(_this);
      if (!isSupported('input', 'placeholder') && config.placeholder) {
        targetForm.off('submit', commonSubmitCheckup);
        targetForm.on('submit', commonSubmitCheckup);
        placeholderInit();
      } else {
        config.placeholder = false;
      }
      if (!isSupported('input', 'autofocus') && config.autofocus) {
        autofocusInit();
      } else {
        config.autofocus = false;
      }
      formAlternatives = false;
      if (!isSupported('input', 'formAction') && config.formaction) {
        formAlternatives = true;
      } else {
        config.formaction = false;
      }
      if (!isSupported('input', 'formEnctype') && config.formenctype) {
        formAlternatives = true;
      } else {
        config.formenctype = false;
      }
      if (!isSupported('input', 'formMethod') && config.formmethod) {
        formAlternatives = true;
      } else {
        config.formmethod = false;
      }
      if (!isSupported('input', 'formTarget') && config.formtarget) {
        formAlternatives = true;
      } else {
        config.formtarget = false;
      }
      if (formAlternatives) {
        targetForm.off('submit', commonSubmitCheckup);
        targetForm.on('submit', commonSubmitCheckup);
        formAlternativesInit();
      }
    };
    isSupported = function(theElement, theAttribute) {
      var testElement;
      testElement = document.createElement(theElement);
      return theAttribute in testElement;
    };
    commonSetCaret = function(currentElement, position) {
      var part;
      if (currentElement[0].createTextRange) {
        part = currentElement[0].createTextRange();
        part.collapse(true);
        part.moveEnd('character', position);
        part.moveStart('character', position);
        part.select();
      } else if (currentElement[0].setSelectionRange) {
        currentElement[0].setSelectionRange(position, position);
      }
    };
    commonPresubmitCheckup = function() {
      var currentTextbox, i, placeholderTextBox, _i, _len;
      if (!isSupported('input', 'placeholder') && config.placeholder) {
        placeholderTextBoxes = targetForm.find('*[placeholder]');
        placeholderTextBoxes.off();
        for (i = _i = 0, _len = placeholderTextBoxes.length; _i < _len; i = ++_i) {
          placeholderTextBox = placeholderTextBoxes[i];
          currentTextbox = placeholderTextBoxes.eq(i);
          if (currentTextbox.val() === currentTextbox.attr('placeholder')) {
            currentTextbox.val('');
            currentTextbox.removeClass(config.placeholderClass);
          }
        }
      }
      return true;
    };
    commonSubmitCheckup = function(e) {
      targetForm.off('submit', commonSubmitCheckup);
      e.preventDefault();
      if (commonPresubmitCheckup()) {
        targetForm.trigger('submit');
      }
    };
    placeholderInit = function() {
      placeholderTextBoxes = targetForm.find('*[placeholder]');
      placeholderTextBoxes.on('focus click keyup keydown keypress', placeholderCheckFocus);
      placeholderTextBoxes.on('keyup textinput', placeholderCheckValues);
      placeholderSetValues();
    };
    placeholderCheckFocus = function() {
      var currentElement;
      currentElement = jQuery(this);
      if (currentElement.hasClass(config.placeholderClass)) {
        commonSetCaret(currentElement, 0);
      }
    };
    placeholderCheckValues = function() {
      var currentElement;
      currentElement = jQuery(this);
      if (currentElement.val() === '') {
        currentElement.addClass(config.placeholderClass);
        currentElement.val(currentElement.attr('placeholder'));
        if (currentElement.attr('type') === 'password') {
          currentElement = placeholderReplaceWithType(currentElement, 'text');
          currentElement.focus();
        }
        commonSetCaret(currentElement, 0);
      } else {
        if (currentElement.hasClass(config.placeholderClass) && currentElement.val() !== currentElement.attr('placeholder')) {
          currentElement.removeClass(config.placeholderClass);
          if (currentElement.hasClass('formFivePlaceholder')) {
            currentElement = placeholderReplaceWithType(currentElement, 'password');
            commonSetCaret(currentElement, 99999);
            currentElement.focus();
          }
          if (currentElement.index(currentElement.attr('placeholder'))) {
            currentElement.val(currentElement.val().replace(currentElement.attr('placeholder'), ''));
          }
        }
      }
    };
    placeholderSetValues = function() {
      var currentTextbox, i, placeHolderTextBox, _i, _len;
      for (i = _i = 0, _len = placeholderTextBoxes.length; _i < _len; i = ++_i) {
        placeHolderTextBox = placeholderTextBoxes[i];
        currentTextbox = placeholderTextBoxes.eq(i);
        if (currentTextbox.val() === '' || currentTextbox.val() === currentTextbox.attr('placeholder')) {
          currentTextbox.val(currentTextbox.attr('placeholder'));
          currentTextbox.addClass(config.placeholderClass);
          if (currentTextbox.attr('type') === 'password') {
            currentTextbox.addClass('formFivePlaceholder');
            currentTextbox = placeholderReplaceWithType(currentTextbox, 'text');
          }
        }
      }
    };
    placeholderReplaceWithType = function(currentTextbox, newType) {
      var eThis, newAttributes, newTextbox, oldAttribute, oldAttributes, x, _i, _len;
      eThis = currentTextbox.get(0);
      oldAttributes = eThis.attributes;
      newAttributes = {};
      for (_i = 0, _len = oldAttributes.length; _i < _len; _i++) {
        oldAttribute = oldAttributes[_i];
        if (oldAttribute.specified === true) {
          newAttributes[oldAttribute.name] = oldAttribute.value;
        }
      }
      newAttributes['type'] = newType;
      newTextbox = jQuery(document.createElement('input'));
      for (x in newAttributes) {
        newTextbox.attr(x, newAttributes[x]);
      }
      newTextbox.val(currentTextbox.val());
      newTextbox.on('focus click keyup', placeholderCheckFocus);
      newTextbox.on('keyup', placeholderCheckValues);
      currentTextbox.replaceWith(newTextbox);
      return newTextbox;
    };
    autofocusInit = function() {
      var autofocusElement;
      autofocusElement = targetForm.find('*[autofocus]');
      commonSetCaret(autofocusElement.eq(0), 0);
    };
    formAlternativesInit = function() {
      var formactionElement, formactionElements, formenctypeElement, formenctypeElements, formmethodElement, formmethodElements, formtargetElement, formtargetElements, i, j, k, l, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      if (config.formaction) {
        formactionElements = targetForm.find('*[formaction]');
        for (i = _i = 0, _len = formactionElements.length; _i < _len; i = ++_i) {
          formactionElement = formactionElements[i];
          formactionElements.eq(i).on('click', formAlternativesChangeAttribute);
        }
      }
      if (config.formenctype) {
        formenctypeElements = targetForm.find('*[formenctype]');
        for (j = _j = 0, _len1 = formenctypeElements.length; _j < _len1; j = ++_j) {
          formenctypeElement = formenctypeElements[j];
          formenctypeElements.eq(j).off('click');
          formenctypeElements.eq(j).on('click', formAlternativesChangeAttribute);
        }
      }
      if (config.formmethod) {
        formmethodElements = targetForm.find('*[formmethod]');
        for (k = _k = 0, _len2 = formmethodElements.length; _k < _len2; k = ++_k) {
          formmethodElement = formmethodElements[k];
          formmethodElements.eq(k).off('click');
          formmethodElements.eq(k).on('click', formAlternativesChangeAttribute);
        }
      }
      if (config.formtarget) {
        formtargetElements = targetForm.find('*[formtarget]');
        for (l = _l = 0, _len3 = formtargetElements.length; _l < _len3; l = ++_l) {
          formtargetElement = formtargetElements[l];
          formtargetElements.eq(l).off('click');
          formtargetElements.eq(l).on('click', formAlternativesChangeAttribute);
        }
      }
    };
    formAlternativesChangeAttribute = function(e) {
      var clickedButton;
      targetForm.off('submit', commonSubmitCheckup);
      e.preventDefault();
      clickedButton = jQuery(this);
      if (clickedButton.attr('formaction') !== '' && config.formaction) {
        targetForm.attr('action', clickedButton.attr('formaction'));
      }
      if (clickedButton.attr('formenctype') !== '' && config.formenctype) {
        targetForm.attr('enctype', clickedButton.attr('formenctype'));
      }
      if (clickedButton.attr('formmethod') !== '' && config.formmethod) {
        targetForm.attr('method', clickedButton.attr('formmethod'));
      }
      if (clickedButton.attr('formtarget') !== '' && config.formtarget) {
        targetForm.attr('target', clickedButton.attr('formtarget'));
      }
      if (commonPresubmitCheckup()) {
        targetForm.trigger('submit');
      }
    };
    init();
    return this;
  };

}).call(this);
