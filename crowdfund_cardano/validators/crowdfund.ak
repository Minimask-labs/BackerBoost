use aiken/collection/dict
use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}

// Campaign state stored in Datum as a list of tuples
pub type Campaign {
  boss: VerificationKeyHash,
  goal: Int,
  raised: Int,
  alive: Bool,
  vault: List<(VerificationKeyHash, Int)>,
}

// Redeemer actions
pub type Action {
  Start(Int)
  Fund(Int, VerificationKeyHash)
  Claim(Int)
  Refund(Int, VerificationKeyHash, Int)
  Kill(Int)
}

pub type Redeemer {
  action: Action,
}

validator campaign_validator {
  spend(
    datum: Option<Campaign>,
    redeemer: Redeemer,
    _own_ref: OutputReference,
    tx: Transaction,
  ) {
    expect Some(Campaign { boss, goal, raised, alive, vault }) = datum

    // Convert List<(VerificationKeyHash, Int)> into Dict<ByteArray, Int>
    let vault_dict =
      dict.from_pairs(list.map(vault, fn((k, v)) { Pair(k, v) }))

    // Check if boss signed the transaction
    let signer_present = list.any(tx.extra_signatories, fn(vk) { vk == boss })

    when redeemer.action is {
      Start(_) ->
        // Invalid on-chain; campaign must already exist
        False

      Fund(amount, contributor) -> {
        let valid_amount = amount > 0

        let previous =
          when dict.get(vault_dict, contributor) is {
            Some(value) -> value
            None -> 0
          }

        let contributed = previous + amount

        // Dummy insert to mimic state update (not persistent here)
        expect _updated_dict =
          dict.insert(
            vault_dict,
            contributor,
            contributed
          )

        let new_raised = raised + amount

        valid_amount && alive && new_raised >= raised
      }

      Claim(_) -> alive && raised >= goal && signer_present

      Refund(_, caller, amount) -> {
        let contributed =
          when dict.get(vault_dict, caller) is {
            Some(value) -> value
            None -> 0
          }

        !alive && raised < goal && amount == contributed
      }

      Kill(_) -> alive && raised < goal && signer_present
    }
  }

  else(_) {
    fail
  }
}
