App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      console.log("init $.getJson");
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    
    //Modern dapp browsers
    if(window.ethereum) {
      App.web3Provider = window.ethereum;
      console.log("web3Provider = ", App);
      try {
        //Request account access
        await window.ethereum.enable();

      } catch (error) {
        // user denied access
        console.error("user denied account access");
      }
    }

    // Legacy dapp browsers....
    else if(window.web3) {
      App.web3Provider = window.web3.currentProvider;
      console.log("web3ProviderLegacy = ", window.web3.currentProvider);
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      console.log("web3provider Ganache", App.web3Provider);
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    console.log("initContract");
    $.getJSON('Adoption.json', function(data){
      console.log("initContract getjson");
      // Get necessary contract artifact file and instantiate it with @truffle/contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      // console.log("AdoptionArtifact = ", AdoptionArtifact);

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    console.log("Button Click bindEvents");
    $(document).on('click', '.btn-adopt', App.handleAdopt);
    console.log("onclick event");
  },

  markAdopted: function() {
    var adoptionInstance;
    console.log("Mark as adopted");
    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      console.log("adoptionInstance inside markAdopted ", adoptionInstance);
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for(i = 0;i<adopters.length; i++) {
        if(adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();
    console.log("Handler for adopt");
    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      console.log("adoption account = ", account);
      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        console.log("AdoptionInstance inside handleAdopt = ", adoptionInstance);
        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, {from: account});
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
