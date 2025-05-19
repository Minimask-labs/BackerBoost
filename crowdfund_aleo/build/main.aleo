import credits.aleo;
program crowdfund_aleo.aleo;

struct Campaign:
    boss as address;
    goal as u64;
    raised as u64;
    alive as boolean;

mapping vault:
    key as address.public;
    value as u64.public;

mapping projects:
    key as u32.public;
    value as Campaign.public;

function start:
    input r0 as u64.private;
    gt r0 0u64 into r1;
    assert.eq r1 true;
    add 0u32 1u32 into r2;
    async start r2 self.caller r0 into r3;
    output r3 as crowdfund_aleo.aleo/start.future;

finalize start:
    input r0 as u32.public;
    input r1 as address.public;
    input r2 as u64.public;
    cast r1 r2 0u64 true into r3 as Campaign;
    set r3 into projects[r0];

function fund:
    input r0 as u32.private;
    input r1 as u64.private;
    gt r1 0u64 into r2;
    assert.eq r2 true;
    is.eq self.caller self.caller into r3;
    assert.eq r3 true;
    call credits.aleo/transfer_public_as_signer self.caller r1 into r4;
    async fund r4 self.caller r0 r1 into r5;
    output r5 as crowdfund_aleo.aleo/fund.future;

finalize fund:
    input r0 as credits.aleo/transfer_public_as_signer.future;
    input r1 as address.public;
    input r2 as u32.public;
    input r3 as u64.public;
    await r0;
    get projects[r2] into r4;
    assert.eq r4.alive true;
    add r4.raised r3 into r5;
    cast r4.boss r4.goal r5 r4.alive into r6 as Campaign;
    set r6 into projects[r2];
    get.or_use vault[r1] 0u64 into r7;
    add r7 r3 into r8;
    set r8 into vault[r1];

function claim:
    input r0 as address.private;
    input r1 as u64.private;
    input r2 as u32.private;
    is.eq r0 self.caller into r3;
    assert.eq r3 true;
    call credits.aleo/transfer_public r0 r1 into r4;
    async claim r2 r1 self.caller r4 into r5;
    output r5 as crowdfund_aleo.aleo/claim.future;

finalize claim:
    input r0 as u32.public;
    input r1 as u64.public;
    input r2 as address.public;
    input r3 as credits.aleo/transfer_public.future;
    await r3;
    get projects[r0] into r4;
    is.eq r2 r4.boss into r5;
    assert.eq r5 true;
    gte r4.goal r1 into r6;
    assert.eq r6 true;
    gte r4.raised r4.goal into r7;
    assert.eq r7 true;
    assert.eq r4.alive true;
    cast r4.boss r4.goal r4.raised false into r8 as Campaign;
    set r8 into projects[r0];

function ragequit:
    input r0 as u32.private;
    input r1 as u64.private;
    call credits.aleo/transfer_public self.caller r1 into r2;
    async ragequit r0 r1 self.caller r2 into r3;
    output r3 as crowdfund_aleo.aleo/ragequit.future;

finalize ragequit:
    input r0 as u32.public;
    input r1 as u64.public;
    input r2 as address.public;
    input r3 as credits.aleo/transfer_public.future;
    await r3;
    get projects[r0] into r4;
    not r4.alive into r5;
    assert.eq r5 true;
    lt r4.raised r4.goal into r6;
    assert.eq r6 true;
    get vault[r2] into r7;
    gt r7 0u64 into r8;
    is.eq r7 r1 into r9;
    and r8 r9 into r10;
    assert.eq r10 true;
    set 0u64 into vault[r2];

function kill:
    input r0 as u32.private;
    async kill r0 self.caller into r1;
    output r1 as crowdfund_aleo.aleo/kill.future;

finalize kill:
    input r0 as u32.public;
    input r1 as address.public;
    get projects[r0] into r2;
    is.eq r1 r2.boss into r3;
    assert.eq r3 true;
    lt r2.raised r2.goal into r4;
    assert.eq r4 true;
    cast r2.boss r2.goal r2.raised false into r5 as Campaign;
    set r5 into projects[r0];
