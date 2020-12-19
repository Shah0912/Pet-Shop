pragma solidity ^0.5.0;
//pragma- additional info
// ^ - version this or higher

contract Adoption {

    address[16] public adopters;
    // Length is pre-defined to number of dogs in the pet store
    // Public variables auto-generate the getter functions, however it will require a key, to get the whole array we'll write a function


    //Adopting a pet
    function adopt(uint petId) public returns (uint) {
        require (petId >= 0 && petId <= 15);
        // Check if the petId is valid. 

        adopters[petId] = msg.sender;
        // Assign the address of the message sender to the adopters in the index corresponding to the petId

        return petId;
        // return id of the pet that is adopted as a confirmation.
    }

    //Memory gives data location for the variable.
    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

}
