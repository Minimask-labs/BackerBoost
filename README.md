# BackerBoost

# CONTRACT DEPLOYMENT LINK
https://testnet.aleoscan.io/program?id=crowdfund_beta.aleo

# PREVIEW
### BEFORE
![Screenshot from 2025-05-19 03-43-32](https://github.com/user-attachments/assets/24937114-dd53-4b0a-b270-1cdfc2c27a6c)


### AFTER
![Screenshot from 2025-05-19 03-42-30](https://github.com/user-attachments/assets/4a0d18ad-90f6-4f96-ab61-ea1b16a1e8df)

![Screenshot from 2025-05-19 03-44-29](https://github.com/user-attachments/assets/8e9e3b5f-c0f6-4a48-9395-7c99847edb6e)



# CONTRACT OVERVIEW

This contract implements a basic crowdfunding system where:

- Creators can launch campaigns with a funding goal

- Backers can contribute to active campaigns

- Creators can claim funds if the goal is reached

- Backers can get refunds if the goal isn't met

- Creators can cancel unsuccessful campaigns


# CONTRACT FUNCTIONS (USAGE)
1. `start` Function
- Launches a new crowdfunding campaign.

```async transition start(goal: u64) -> Future```

### Parameters:

- goal: The funding target amount in credits

### Behavior:

- Creates a new campaign with the specified goal

- Initializes raised amount to 0

- Sets campaign status to active

- Returns a campaign ID

2. `fund` Function
- Allows backers to contribute to a campaign.

```async transition fund(project_id: u32, amount: u64) -> Future```

### Parameters:

- project_id: The ID of the campaign to fund

- amount: The amount to contribute

### Behavior:

- Transfers credits from backer to contract

- Updates campaign's raised amount

- Tracks individual contributions in vault

3. `claim` Function
- Allows campaign creator to withdraw funds after goal is reached.

```async transition claim(claimer: address, amount: u64, project_id: u32) -> Future```

### Parameters:

- project_id: The ID of the successful campaign

- amount: The amount to withdraw (must match raised amount)

### Behavior:

- Verifies campaign reached its goal

- Transfers funds to creator

- Marks campaign as completed

4. `ragequit` Function
- Allows backers to get refunds for unsuccessful campaigns.

```async transition ragequit(project_id: u32, amount: u64) -> Future```

### Parameters:

- project_id: The ID of the failed campaign

- amount: The amount to refund (must match original contribution)

### Behavior:

- Verifies campaign failed to reach goal

- Returns contributor's original amount

- Updates vault balance

5. `kill` Function 
- Allows creator to cancel an unsuccessful campaign.

```async transition kill(project_id: u32) -> Future```

### Parameters:

- project_id: The ID of the campaign to cancel

### Behavior:

- Marks campaign as inactive

- Must be called before backers can get refunds

