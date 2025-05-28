use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{
  InlineDatum, Input, Output, OutputReference, ScriptContext, Spend, Transaction,
}
use aiken/transaction/credential.{Address, Script, Verification_key}
use aiken/transaction/value.{Value}

validator crowdfund {

  ProjectId =
  Hash<Blake2b_224, ProjectId>

  Campaign {
  boss: Address,
  goal: Int,
  raised: Int,
  alive: Bool,
  project_id: ProjectId,
}

  FunderInfo {
  funder: Address,
  amount: Int,
}

  Action {
  Start { goal: Int }
  Fund { amount: Int }
  Claim { amount: Int }
  Refund
  Kill
}

fn find_input_campaign(
  transaction: Transaction,
  output_reference: OutputReference,
) -> Option<Campaign> {
  transaction.inputs
    |> list.find(fn(input) { input.output_reference == output_reference })
    |> map(fn(input) { input.output.datum })
    |> map(fn(datum) {
      when datum is {
        InlineDatum(d) -> Some(d)
        _ -> None
      }
    })
    |> flatten
}

fn must_be_signed_by(transaction: Transaction, address: Address) -> Bool {
  transaction.extra_signatories |> list.has(address)
}

  fn evaluate(datum: Campaign, redeemer: Action, ctx: ScriptContext) -> Bool {
    let ScriptContext { transaction, purpose } = ctx
    
    expect Spend(output_reference) = purpose

    when redeemer is {
      Start { goal } -> {
        // Validate campaign creation
        and {
          goal > 0,
          datum.goal == goal,
          datum.raised == 0,
          datum.alive == True,
        }
      }
      
      Fund { amount } -> {
        // Validate funding
        let input_campaign = find_input_campaign(transaction, output_reference)?
        
        and {
          amount > 0,
          input_campaign.alive == True,
          datum.raised == input_campaign.raised + amount,
          datum.goal == input_campaign.goal,
          datum.boss == input_campaign.boss,
          datum.alive == input_campaign.alive,
          datum.project_id == input_campaign.project_id,
        }
      }
      
      Claim { amount } -> {
        // Validate claiming funds
        let input_campaign = find_input_campaign(transaction, output_reference)?
        
        and {
          must_be_signed_by(transaction, datum.boss),
          input_campaign.raised >= input_campaign.goal,
          input_campaign.alive == True,
          amount <= input_campaign.raised,
          datum.alive == False,
          datum.boss == input_campaign.boss,
          datum.goal == input_campaign.goal,
          datum.raised == input_campaign.raised,
          datum.project_id == input_campaign.project_id,
        }
      }
      
      Refund -> {
        // Validate refund
        let input_campaign = find_input_campaign(transaction, output_reference)?
        
        and {
          input_campaign.raised < input_campaign.goal,
          !input_campaign.alive,
          datum.alive == False,
          datum.boss == input_campaign.boss,
          datum.goal == input_campaign.goal,
          datum.raised == input_campaign.raised,
          datum.project_id == input_campaign.project_id,
        }
      }
      
      Kill -> {
        // Validate campaign termination
        let input_campaign = find_input_campaign(transaction, output_reference)?
        
        and {
          must_be_signed_by(transaction, datum.boss),
          input_campaign.raised < input_campaign.goal,
          input_campaign.alive == True,
          datum.alive == False,
          datum.boss == input_campaign.boss,
          datum.goal == input_campaign.goal,
          datum.raised == input_campaign.raised,
          datum.project_id == input_campaign.project_id,
        }
      }
    }
  }
} 