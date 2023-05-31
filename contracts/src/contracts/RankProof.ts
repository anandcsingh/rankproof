import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PublicKey,
} from 'snarkyjs';

export class RankProof extends SmartContract {
  @state(Field) ibjjf = State<Field>();
  @state(Field) itf = State<Field>();
  @state(Field) wkf = State<Field>();
  @state(PublicKey) blackBelt = State<PublicKey>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
    this.blackBelt.set(
      PublicKey.fromBase58(
        'B62qpzAWcbZSjzQH9hiTKvHbDx1eCsmRR7dDzK2DuYjRT2sTyW9vSpR'
      )
    );
  }

  @method initState(
    instructor: PublicKey,
    ibjjfState: Field,
    itfState: Field,
    wkfState: Field
  ) {
    this.blackBelt.set(instructor);
    this.ibjjf.set(ibjjfState);
    this.itf.set(itfState);
    this.wkf.set(wkfState);
  }

  @method changeBlackBelt(certifier: PublicKey) {
    const bbState = this.blackBelt.get();
    this.blackBelt.assertEquals(bbState);
    this.blackBelt.set(certifier);
  }

  @method changeIbjjf(data: Field) {
    const ibjjfState = this.ibjjf.get();
    this.ibjjf.assertEquals(ibjjfState);
    this.ibjjf.set(data);
  }

  @method certifyIbjjf(
    certifier: PublicKey,
    useroldData: Field,
    userNewData: Field
  ) {
    const ibjjfState = this.ibjjf.get();
    this.ibjjf.assertEquals(ibjjfState);

    // how do I get the user that called the contract?
    this.blackBelt.assertEquals(certifier);
    this.ibjjf.set(userNewData);
  }

  @method certifyWkf(
    certifier: PublicKey,
    useroldData: Field,
    userNewData: Field
  ) {
    const wkfState = this.wkf.get();
    this.wkf.assertEquals(wkfState);

    // how do I get the user that called the contract?
    this.blackBelt.assertEquals(certifier);
    this.wkf.set(userNewData);
  }

  @method certifyItf(
    certifier: PublicKey,
    useroldData: Field,
    userNewData: Field
  ) {
    const itffState = this.itf.get();
    this.itf.assertEquals(itffState);

    // how do I get the user that called the contract?
    this.blackBelt.assertEquals(certifier);
    this.itf.set(userNewData);
  }
}
