pragma solidity ^0.5.0;

// Gives us various assertions
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());
    // Address of the adoption contract to be testetd

    uint expectedPetId = 8;
    // id of the pet that will be used for testing

    address expectedAdopter = address(this);
    // Expected owner of adopted pet is this contract

    //Testing the adopt() function
    function testUserCanAdoptPet() public {
        // Returns the Pet id
        uint returnedId = adoption.adopt(expectedPetId);

        // Asserts equality of returnedId and expectedId
        Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
    }

    // Testing retrieval of a single pet's owner
    function testGetAdopterAddressByPetId() public {
        // Get the address of the adopter
        address adopter = adoption.adopters(expectedPetId);

        // exptected adopter and actual adopter should be equal
        Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
    }

    // Testing retrieval of all pet owners
    function testGetAdopterAddressByPetIdInArray() public {
        // Store adopters in memory rather than contract's storage
        address[16] memory adopters = adoption.getAdopters();

        Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
    }

}