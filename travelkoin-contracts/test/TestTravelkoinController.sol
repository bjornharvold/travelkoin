pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TravelkoinController.sol";


contract TestTravelkoinController {
    TravelkoinController controller = TravelkoinController(DeployedAddresses.TravelkoinController());

    // Testing nothing
    function testMyTest() public {
        uint returnedId = 8;

        uint expected = 8;

        Assert.equal(returnedId, expected, "Should be 8");
    }

    // Test isCrowdsaleOpen
    function testIsCrowdsaleOpen() public {
        bool isOpen = controller.isCrowdsaleOpen();

        Assert.isFalse(isOpen, "Should not be open");
    }

    // Test setNewController
    function testSetNewController() public {
        controller.setNewController();
    }

//
//    function testGetAdopterAddressByPetId() public {
//        // Expected owner is this contract
//        address expected = this;
//
//        address adopter = controller.adopters(8);
//
//        Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
//    }
//
//    // Testing retrieval of all pet owners
//    function testGetAdopterAddressByPetIdInArray() public {
//        // Expected owner is this contract
//        address expected = this;
//
//        // Store adopters in memory rather than contract's storage
//        address[16] memory adopters = controller.getAdopters();
//
//        Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded.");
//    }
}