// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract AuctionSystem {
    struct Auction {
        uint256 id;
        string name;
        uint256 deadline;
        address owner;
        uint256 highestBid;
        address highestBidder;
        mapping(address => uint256) bids;
        address[] bidders;
    }

    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );

    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCount = 0;

    function createAuction(string memory _name, uint256 _minutesFromNow)
        public
    {
        require(_minutesFromNow > 0, "Duration must be > 0");

        uint256 deadline = block.timestamp + (_minutesFromNow * 1 minutes);

        Auction storage a = auctions[auctionCount];
        a.id = auctionCount;
        a.name = _name;
        a.deadline = deadline;
        a.owner = msg.sender;
        a.highestBidder = address(0);

        auctionCount++;
    }

    function bid(uint256 _auctionId) external payable {
        require(_auctionId < auctionCount, "Auction does not exist");

        Auction storage a = auctions[_auctionId];

        require(block.timestamp < a.deadline, "Auction has ended");
        require(msg.value > 0, "You must send BNB to place a bid");

        require(a.bids[msg.sender] == 0, "You have already placed a bid");

        require(msg.sender != a.owner, "Owner cannot bid");

        require(msg.value > a.highestBid, "Bid too low");

        a.bids[msg.sender] = msg.value;
        a.highestBid = msg.value;
        a.highestBidder = msg.sender;
        a.bidders.push(msg.sender);

        emit BidPlaced(_auctionId, msg.sender, msg.value);
    }

    function getAuctionWinner(uint256 _auctionId)
        public
        view
        returns (address winner)
    {
        require(_auctionId < auctionCount, "Auction does not exist");

        Auction storage a = auctions[_auctionId];
        require(block.timestamp >= a.deadline, "Auction not finished yet");

        if (a.highestBidder == address(0)) {
            return address(0);
        }

        return a.highestBidder;
    }

    function withdrawBid(uint256 _auctionId) public {
        require(_auctionId < auctionCount, "Auction does not exist");

        Auction storage a = auctions[_auctionId];
        require(block.timestamp >= a.deadline, "Auction not finished yet");

        address bidder = msg.sender;
        uint256 refund = a.bids[bidder];

        require(bidder != a.owner, "Owner cannot claim");
        require(refund > 0, "No bid to claim");
        require(bidder != a.highestBidder, "Winner cannot claim");
        

        a.bids[bidder] = 0;

        payable(bidder).transfer(refund);
    }

    function getAllAuctions()
        public
        view
        returns (
            uint256[] memory ids,
            string[] memory names,
            uint256[] memory deadlines,
            address[] memory owners,
            uint256[] memory highestBids,
            address[] memory highestBidders,
            address[][] memory allBidders,
            uint256[][] memory allAmounts
        )
    {
        uint256 count = auctionCount;

        ids = new uint256[](count);
        names = new string[](count);
        deadlines = new uint256[](count);
        owners = new address[](count);
        highestBids = new uint256[](count);
        highestBidders = new address[](count);
        allBidders = new address[][](count);
        allAmounts = new uint256[][](count);

        for (uint256 i = 0; i < count; i++) {
            Auction storage a = auctions[i];
            ids[i] = a.id;
            names[i] = a.name;
            deadlines[i] = a.deadline;
            owners[i] = a.owner;
            highestBids[i] = a.highestBid;
            highestBidders[i] = a.highestBidder;

            // Get bidder addresses
            uint256 len = a.bidders.length;
            address[] memory bidders = new address[](len);
            uint256[] memory amounts = new uint256[](len);

            for (uint256 j = 0; j < len; j++) {
                address bidder = a.bidders[j];
                bidders[j] = bidder;
                amounts[j] = a.bids[bidder];
            }

            allBidders[i] = bidders;
            allAmounts[i] = amounts;
        }
    }
}
