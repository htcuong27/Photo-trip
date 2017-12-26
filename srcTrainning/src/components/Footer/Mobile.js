import React from 'react';
import Global from './Global';
import Button from '../Button/';
import Div from '../Div/';
import Span from '../Span/';
import Input from '../Input/';
import Image from '../Image/';
import Link from '../Link/';
import Icon from '../Icon/';
import RenderHTML from '../../components/RenderHtml';

import styles from './styles.scss';
import { map } from '../../utils/object';

export default class Mobile extends Global {
  constructor(props) {
    super(props);
    this.data = <Div />
    this.count = 0;
    this.loaded = false;
    this._device = this.props.isNative ? 'app' : 'web';
    this._handleprops();
  }
  componentDidMount() {
    this._handleprops();
  }
  _handleprops = () => {
    if (this.loaded) {
      return;
    }
    this.loaded = true;
    const json = {
      type: "div",
      style: "footerContent",
      child: [
        {
          type: "div",
          child: [
            {
              type: "div",
              child: [
                {
                  type: "div",
                  style: "headerFooter",
                  child: [
                    {
                      title: "Tìm hiểu về Umbala.vn",
                      type: "span",
                      style: "headerFooterList"
                    },
                    {
                      type: "div",
                      style: "IconDropDown",
                      child: [
                        {
                          title: "fi-chevron-down-1",
                          type: "icon",
                          style: "titleFooter"
                        }
                      ]
                    }
                  ]
                },
                {
                  type: "div",
                  style: "ContentChildList",
                  child: [
                    {
                      title: "Giới thiệu về Umbala",
                      to: {
                        pathname: "/gioi-thieu-8vlIvOUpbl.html"
                      },
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Quy chế hoạt động",
                      to: {
                        pathname: "/quy-che-hoat-dong-ecFjX4Hhcl.html"
                      },
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Điều khoản giao dịch",
                      to: {
                        pathname: "/dieu-khoan-giao-dich-kRbgJl4rcl.html"
                      },
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Thông báo từ Umbala",
                      to: {
                        pathname: "/thong-bao-tu-umbala-uEKd8U90gb.html"
                      },
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Câu hỏi thường gặp",
                      to: {
                        pathname: "/cau-hoi-thuong-gap-aajQods0gb.html"
                      },
                      style: "span",
                      type: "span"
                    }
                  ]
                }
              ]
            },
            {
              type: "div",
              child: [
                {
                  type: "div",
                  style: "headerFooter",
                  child: [
                    {
                      title: "Chính sách & Dịch vụ",
                      type: "span",
                      style: "headerFooterList"
                    },
                  ]
                },
                {
                  type: "div",
                  style: "ContentChildList",
                  child: [
                    {
                      title: "Chính sách bảo mật thông tin",
                      to: {
                        pathname: "/chinh-sach-bao-mat-thong-tin-GxonLgOCcl.html"
                      },
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Chính sách hàng hóa",
                      to: {
                        pathname: "/chinh-sach-hang-hoa-cV2lwuMmcl.html"
                      },
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Chính sách thành viên",
                      to: {
                        pathname: "/chinh-sach-thanh-vien-S53w4mfYbl.html"
                      },
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Chính sách thanh toán",
                      to: {
                        pathname: "/chinh-sach-thanh-toan-Ug4nhzDmcl.html"
                      },
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Chính sách đổi trả",
                      to: {
                        pathname: "/chinh-sach-doi-tra-obwSKKDXbl.html"
                      },
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Chính sách bảo hành",
                      to: {
                        pathname: "/chinh-sach-bao-hanh-2kseGiYXbl.html"
                      },
                      style: "span",
                      type: "span"
                    }
                  ]
                }
              ]
            },
            {
              type: "div",
              condition: "web",
              child: [
                {
                  type: "div",
                  style: "headerFooter",
                  child: [
                    {
                      title: "Quản lý dễ dàng với ứng dụng umbala.vn",
                      type: "span",
                      style: "FontFooter",
                    }
                  ]
                },
                {
                  type: "div",
                  style: "ContentChildList",
                  child: [
                    {
                      type: "div",
                      style: "appDownloadButtons",
                      child: [
                        {
                          title: 'http://img.umbala.vn/btn-googlePlay.png',
                          type: "image",
                          to: {
                            pathname: "https://play.google.com/store/apps/details?id=com.umbala.app"
                          },
                          style: "appLink"
                        },
                        {
                          title: 'http://img.umbala.vn/btn-appStore.png',
                          type: "image",
                          to: {
                            pathname: "https://itunes.apple.com/vn/app/umbala-viet-nam/id1249953525"
                          },
                          style: "appLink"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          style: "ContentChildList",
          type: "div",
          child: [
            {
              type: "div",
              style: "col4",
              child: [
                {
                  title: "CÔNG TY CỔ PHẦN UMBALA VIỆT NAM",
                  type: "span",
                  style: "titleFooter"
                },
                {
                  type: "div",
                  style: "ViewUl",
                  child: [
                    {
                      title: "Mã số thuế: 0314329846",
                      style: "span",
                      type: "span"
                    },
                    {
                      title: "Địa chỉ: Toà nhà VVA Tower, 277-279 Lý Tự Trọng, Phường Bến Thành, Quận 1, Hồ Chí Minh",
                      style: "span",
                      type: "span"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          style: "footerLienHe",
          type: "div",
          child: [
            {
              style: "tongDai",
              type: "div",
              child: [
                {
                  type: "span",
                  style: "Phone",
                  title: "Tổng đài:"
                },
                {
                  type: "div",
                  style: {
                    flexDirection: "row"
                  },
                  child: [
                    {
                      type: "span",
                      title: "1900 7059",
                      style: "phoneDomain",
                      to: "callto:19007059"
                    },
                    {
                      style: "spanSplash",
                      title: "-",
                      type: "span"
                    },
                    {
                      type: "span",
                      title: "(028) 7109 7059",
                      style: "phoneDomain",
                      to: "callto:02871097059"
                    }
                  ]
                },
                {
                  type: "span",
                  style: "timeDomain",
                  title: "(8h30 - 22h00)"
                }
              ]
            },
            {
              type: "div",
              style: "daThongBao",
              condition: "web",
              child: [
                {
                  title: this.props.isNative ? require('../../../images/dathongbao.png') : '//vipn.net/styles/app/8084/libs/img/dathongbao.png',
                  to: {
                    pathname: "http://online.gov.vn/CustomWebsiteDisplay.aspx?DocId=33235"
                  },
                  type: "image",
                  style: "imgFooterContent"
                }
              ]
            }
          ]
        },
        {
          type: "span",
          style: "footerCopyRight",
          title: "Copyright @ Forever UMBALA VIETNAM, All Rights reserved"
        }
      ]
    }
    if (typeof json.child === 'object' && json.child !== null && json.child.length > 0) {
      this.count = 0;
      this.data = this._quet(json)
    }
    // this.forceUpdate();
  }
  _quet = (node) => {
    this.count += 1;
    if (this.count > 10000) {
      return;
    }
    if (typeof node.type !== 'string') {
      return;
    }
    
    if (typeof node.condition === 'string' && node.condition !== this._device) {
      return;
    }
    const children = [];
    if (typeof node.child === 'object' && node.child !== null && node.child.length > 0) {
      map(node.child, nodeChild => {
        const child = this._quet(nodeChild);
        if (typeof child !== 'object' || child === null) {
          return true;
        }
        children.push(child);
      });
    }
    let style;
    if (typeof node.style === 'string' && node.style.length > 2) {
      style = styles[node.style];
    } else if (typeof node.style === 'object' && node.style !== null) {
      style = node.style;
    }
    let childCompo;
    if (node.type === 'div') {
      childCompo = <Div style={style}>{children}</Div>
    } else if (node.type === 'span') {
      childCompo = <Span style={style}>{node.title}</Span>
    } else if (node.type === 'image') {
      childCompo = <Image style={style} src={node.title} />
    } else {
      return;
    }
    if ((typeof node.to === 'string' || typeof node.to === 'object') && node.to !== null) {
      return <Link route={this.props.route} to={node.to}>{childCompo}</Link>
    }
    return childCompo;
  }
  render() {
    return this.data;
  }
}