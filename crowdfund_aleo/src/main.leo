import credits.aleo;

program crowdfund_aleo.aleo {
    // Campaign structure
    struct Campaign {
        boss: address,
        goal: u64,
        raised: u64,
        alive: bool
    }

    // Storage
    mapping vault: address => u64;
    mapping projects: u32 => Campaign;


    /* ===== LAUNCH ===== */
    async transition start(goal: u64) -> Future {
        let total_campaigns: u32 = 0u32;

        assert(goal > 0u64);
        let id: u32 = total_campaigns + 1u32;
        return finalize_start(id, self.caller, goal);
    }

    async function finalize_start(
        id: u32,
        boss: address,
        goal: u64
    ) {
        let total_campaigns: u32 = id;
        Mapping::set(projects, id, Campaign {
            boss: boss,
            goal: goal,
            raised: 0u64,
            alive: true
        });
    }

    /* ===== FUND ===== */
    async transition fund(project_id: u32, amount: u64) -> Future {
        assert(amount > 0u64);

        //address caller
        let caller: address = self.caller; 

        assert(caller == self.caller);

        let future : Future = credits.aleo/transfer_public_as_signer(caller, amount);
        return finalize_fund(future, caller, project_id, amount);
    }

    async function finalize_fund(
        f: Future,
        caller: address,
        project_id: u32,
        amount: u64
    ) {
        f.await();
        
        let campaign: Campaign = Mapping::get(projects, project_id);
        assert(campaign.alive);
        
        // Update campaign
        Mapping::set(projects, project_id, Campaign {
            boss: campaign.boss,
            goal: campaign.goal,
            raised: campaign.raised + amount,
            alive: campaign.alive
        });
        
        // Update vault
        let current: u64 = Mapping::get_or_use(vault, caller, 0u64);
        Mapping::set(vault, caller, (current + amount));
    }

    /* ===== CLAIM ===== */
    async transition claim(claimer: address, amount: u64, project_id: u32) -> Future {
        
        //make sure claimer == self.caller
        assert(claimer == self.caller);

        let future: Future = credits.aleo/transfer_public(claimer, amount);

        return finalize_claim(project_id, amount, self.caller, future);
    }

    async function finalize_claim(
        project_id: u32,
        amount: u64,
        caller: address,
        f: Future
    ) {
        f.await();
        let campaign : Campaign = Mapping::get(projects, project_id);
        assert(caller == campaign.boss);
        assert(campaign.goal >= amount);
        assert(campaign.raised >= campaign.goal);
        assert(campaign.alive);
        
        // Calculate payout (98%) and fee (2%)
        //let fee : u64 = campaign.raised / 50u64;
        //let payout: u64 = campaign.raised - fee;
        
        // Execute transfers
        //let future1 = credits.aleo/transfer_public(campaign.boss, payout);
        //let future2 = credits.aleo/transfer_public(aleo1platformaddress..., fee);
        //future1.await();
        //future2.await();
        
        // Close campaign
        Mapping::set(projects, project_id, Campaign {
            boss: campaign.boss,
            goal: campaign.goal,
            raised: campaign.raised,
            alive: false
        });
    }

    /* ===== REFUND ===== */
    async transition ragequit(project_id: u32, amount: u64) -> Future {
    
        let future: Future = credits.aleo/transfer_public(self.caller, amount);
        return finalize_ragequit(project_id, amount, self.caller, future);
    }

    async function finalize_ragequit(
        project_id: u32,
        amount: u64,
        caller: address,
        f: Future
    ) {
            
        f.await();

        let campaign: Campaign = Mapping::get(projects, project_id);
        assert(!campaign.alive);
        assert(campaign.raised < campaign.goal);
        
        let contribution: u64 = Mapping::get(vault, caller);
        assert((contribution > 0u64) && (contribution == amount));

        Mapping::set(vault, caller, 0u64);
    }

    /* ===== KILL ===== */
    async transition kill(project_id: u32) -> Future {
        return finalize_kill(project_id, self.caller);
    }

    async function finalize_kill(
        project_id: u32,
        caller: address
    ) {
        let campaign: Campaign = Mapping::get(projects, project_id);
        assert(caller == campaign.boss);
        assert(campaign.raised < campaign.goal);
        
        Mapping::set(projects, project_id, Campaign {
            boss: campaign.boss,
            goal: campaign.goal,
            raised: campaign.raised,
            alive: false
        });
    }
}