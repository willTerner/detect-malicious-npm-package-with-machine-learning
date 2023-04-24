import domains from './top-domains.json'

export const IP_Pattern = /(\d{1,3}\.){3}\d{1,3}/

export const base64_Pattern = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

export const bytestring_pattern1 = /(\\x[0-9a-f]{2})+/i // 没用，这个是16进制

// eslint-disable-next-line no-useless-escape
export const bytestring_pattern2 = /\".*(\\x[0-9a-f]{2})+.*\"/i

let domain_pattern: RegExp

export function getDomainPattern () {
  if (domain_pattern) {
    return domain_pattern
  }
  let domain_pattern_string = '([a-zA-Z0-9\\-]+\\.)+'
  const domainArr = domains['most-used-tlds'] as string[]
  for (let i = 0; i < domainArr.length; i++) {
    const domain = domainArr[i].substring(1)
    if (i === 0) {
      domain_pattern_string += '(' + domain + '|'
    } else if (i < domainArr.length - 1) {
      domain_pattern_string += domain + '|'
    } else {
      domain_pattern_string += domain + ')'
    }
  }
  domain_pattern = new RegExp(domain_pattern_string)
  return domain_pattern
}

export const Network_Command_Pattern = /(curl)|(wget)|(host)|(ping)|(\/dev\/tcp)|(ping)/

export const SensitiveStringPattern = /(\/etc\/shadow)|(\.bashrc)|(.zshrc)|(\/etc\/hosts)|(\/etc\/passwd)|(\/bin\/sh)/

export async function pattern_test () {
  const pattern = getDomainPattern()
  let string = new Array(66875).fill('1').join('')
  for (let i = 66875; true; i += 1000) {
    console.log(`字符串长度为${i}. 匹配结果为:` + pattern.test(string))
    string = string + new Array(1000).fill('1').join()
  }
}

// test();
