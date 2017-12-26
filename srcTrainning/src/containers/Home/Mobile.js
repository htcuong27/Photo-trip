import React from 'react';
import Global from './Global';
import Div from '../../components/Div/';
import Span from '../../components/Span/';
import Icon from '../../components/Icon/';
import Button from '../../components/Button/';
import ButtonClick from '../../components/Button/ButtonClick/';
import Input from '../../components/Input/';
import Checkbox from '../../components/Checkbox/';
import styles from './styles.scss';
import Menu from '../../components/Menu';
import ImageText from '../../components/Image/ImageText/';
import FormSearch from '../../components/FormSearch';
import ImageTrip from '../../components/Image/ImageTrip/';
import ImageCircle from '../../components/Image/ImageCircle';
export default class MobileHome extends Global {
  constructor(props) {
    super(props);
    this.arrTab = [
      'Recent',
      'Photos',
      'People',
      'Trips',
      'Blogs',
    ]
    this.arrMenu = [
      'fi-search-1',
      'fi-search-1',
      'fi-search-1',
      'fi-search-1',
      'fi-search-1',
    ]
    this.state = {
      checked: false,
      tabActive: 0,
      menuActive: 0,
    };
  }
  
  render() {
    const { tabActive, menuActive, checked } = this.state;
    return (
      <Div style={[styles.container]}>

        {menuActive === 0 &&
          <Div>
            <Div style={[styles.container__header]}>
            </Div>
            <Div style={[styles.container__content]}>
              <Div style={{paddingBottom: '10px'}}>
                <Span>668 photos.</Span>
              </Div>
              <Div style={[styles.imageflow]}>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
              </Div>
            </Div> 
          </Div>
        }

        {menuActive === 1 &&
          <Div>
            <Div style={[styles.container__header]}>
            <FormSearch></FormSearch>
           </Div>
          <Div style={[styles.main_tab]}>
            <Div style={[styles.main_tab_bar]}>
              {this.arrTab.map((tab, i) => {
                return (
                  <Div
                    key={i}
                    style={{
                      fontWeight: tabActive === i ? 'bold' : 'normal'
                    }}
                    onClick={() => {
                      this.setState({
                        tabActive: i
                      })
                    }}
                  >{tab}</Div>
                )
              })}
            </Div>
          </Div> 
          </Div>
          }

          {menuActive === 1 && tabActive === 0 &&
            <Div style={[styles.recentcontainer__content]}>
              <Div style={[styles.recentcontainer__content__recent]}>
                <Div style={[styles.recentcontainer__content__recent__recentform]}>
                  <Span>#ha giang</Span>
                </Div>
                <Div style={[styles.recentcontainer__content__recent__recentform]}>
                  <Span>#ha giang</Span>
                </Div>
                <Div style={[styles.recentcontainer__content__recent__recentform]}>
                  <Span>#ha giang</Span>
                </Div>
                <Div style={[styles.recentcontainer__content__recent__recentform]}>
                  <Span>#ha giang</Span>
                </Div>
                <Div style={[styles.recentcontainer__content__recent__recentform]}>
                  <Span>#ha giang</Span>
                </Div>
                <Div style={[styles.recentcontainer__content__recent__recentform]}>
                  <Span>#ha giang</Span>
                </Div>
              </Div>
            </Div>
          }

          {menuActive === 1 && tabActive === 1 &&
            <Div style={[styles.image]}>
              <Div style={[styles.image__content]}>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
              </Div>
            </Div>
          }

          {menuActive === 1 && tabActive === 2 &&
            <Div style = {[styles.people]}>
              <Div style = {[styles.people__yo]}>
                <Div style ={[styles.people__yo__IC]}>
                  <ImageCircle sizeImage={'48px'}></ImageCircle>
                </Div>
                <Div style ={[styles.people__yo__Text]}>
                  <Span>anyuta_rai</Span>
                  <Span style={{color: 'gray'}}>@username</Span>
                </Div>
              </Div>
              <Div style = {[styles.people__yo]}>
                <Div style ={[styles.people__yo__IC]}>
                  <ImageCircle sizeImage={'48px'}></ImageCircle>
                </Div>
                <Div style ={[styles.people__yo__Text]}>
                  <Span>anyuta_rai</Span>
                  <Span style={{color: 'gray'}}>@username</Span>
                </Div>
              </Div>
              <Div style = {[styles.people__yo]}>
                <Div style ={[styles.people__yo__IC]}>
                  <ImageCircle sizeImage={'48px'}></ImageCircle>
                </Div>
                <Div style ={[styles.people__yo__Text]}>
                  <Span>anyuta_rai</Span>
                  <Span style={{color: 'gray'}}>@username</Span>
                </Div>
              </Div>
              <Div style = {[styles.people__yo]}>
                <Div style ={[styles.people__yo__IC]}>
                  <ImageCircle sizeImage={'48px'}></ImageCircle>
                </Div>
                <Div style ={[styles.people__yo__Text]}>
                  <Span>anyuta_rai</Span>
                  <Span style={{color: 'gray'}}>@username</Span>
                </Div>
              </Div>
              <Div style = {[styles.people__yo]}>
                <Div style ={[styles.people__yo__IC]}>
                  <ImageCircle sizeImage={'48px'}></ImageCircle>
                </Div>
                <Div style ={[styles.people__yo__Text]}>
                  <Span>anyuta_rai</Span>
                  <Span style={{color: 'gray'}}>@username</Span>
                </Div>
              </Div>
            </Div>

          }

          {menuActive === 1 && tabActive === 3 &&
            <Div style={styles.trip}>
              <ImageTrip></ImageTrip>
            </Div>
          }

          {menuActive === 1 && tabActive === 4 &&
            <Div style={[styles.image]}>
              <Div style={[styles.image__content]}>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
                <ImageText checked={'true'}>Chuyến du lịch vườn quốc gia những ngày cuối.</ImageText>
              </Div>
            </Div>
          }
        <Div style={[styles.container__footer]}>
          <Div style={[styles.menu]}> 
          {this.arrMenu.map((tab, i) => {
              return (
                <Div
                  key={i}
                  onClick={() => {
                    this.setState({
                      menuActive: i
                    })
                  }}
                >

                  <Menu>{tab}</Menu>
                </Div>
              )
            })}
          </Div>  
        </Div>
      </Div>
    );
  }
}
