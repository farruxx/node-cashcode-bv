/**
 * Command.ts
 *
 * @author    Desionlab <fenixphp@gmail.com>
 * @copyright 2017 - 2019 Desionlab
 * @license   MIT
 */

import * as CCNet from './Const';
import { getCRC16 } from './Utils';

/**
 * Class Command
 *
 * An class of device command logic.
 *
 * @version 1.0.0
 */
export class Command {
  /**
   * Device command code.
   */
  protected cmd: number = null;

  /**
   * Command constructor.
   *
   * @param cmd Device command code.
   */
  public constructor(cmd: number) {
    this.cmd = cmd;
  }

  /**
   * Preparing command to send.
   *
   * @param params Parameters of the command being passed.
   */
  public request(params: any | null = []): Buffer {
    return this.assemble(Buffer.from(params));
  }

  /**
   * Processing command response.
   *
   * @param data Data received from the device.
   */
  public response(data: Buffer): any {
    return data;
  }

  /**
   * Assemble command packet.
   *
   * @param params
   */
  protected assemble(params: Buffer = Buffer.alloc(0)): Buffer {
    /* Assemble main packet data. */
    let cmd = Buffer.concat([
      /* Header. */
      Buffer.from([CCNet.SYNC, CCNet.ADR_BILL_VALIDATOR]),
      /* Length. */
      Buffer.from([params.length + 6]),
      /* Command. */
      Buffer.from([this.cmd])
    ]);

    /* Assemble params packet data. */
    if (params.length) {
      cmd = Buffer.concat([
        /* Main packet data. */
        cmd,
        /* Command params. */
        params
      ]);
    }

    /* Assemble full packet data. */
    return Buffer.concat([cmd, getCRC16(cmd)]);
  }
}
