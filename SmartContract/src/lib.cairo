
use starknet::ContractAddress;

#[starknet::interface]
    trait IHoneypot<TContractState> {
        fn set_HoneyPot(ref self: TContractState, tokenAddress: ContractAddress, tokenStatus: u16);
        fn get_if_honeypot(self: @TContractState, tokenAddress: ContractAddress) -> u16;
        fn get_contract_owner(self: @TContractState) -> ContractAddress;
    }

#[starknet::contract]
mod HoneypotOracle {
    use starknet::ContractAddress;
    use starknet::get_caller_address; // Required to use get_caller_address function

    #[storage]
    struct Storage {
        contract_owner: ContractAddress,
        // TODO: Set types for LegacyMap
        tokenStatus: LegacyMap::<ContractAddress, u16>
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.contract_owner.write(owner);
    }


    #[external(v0)]
    impl Honeypt of super::IHoneypot<ContractState> {
        fn set_HoneyPot(
            ref self: ContractState, tokenAddress: ContractAddress, tokenStatus: u16
        ) {
            let caller = get_caller_address();
            let contract_owner = self.get_contract_owner();
            assert(caller == contract_owner, 'Not_Owner');
            self.tokenStatus.write(tokenAddress,tokenStatus)
        }

        fn get_if_honeypot(self: @ContractState, tokenAddress: ContractAddress) -> u16 { // Get user progress
            self.tokenStatus.read(tokenAddress)
        }

        fn get_contract_owner(self: @ContractState) -> ContractAddress {
            self.contract_owner.read()
        }
    }
}




