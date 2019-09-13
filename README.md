## Custom widgets for HADashboard

### [A Shutter widget for HADashboard](https://github.com/rhayun/HADashboard-widgets/tree/master/custom_widgets/baseshutter)

Better cover widget with or without slider
if there is no current_position available from the entity
the widget will be without a slider

```yaml
salon_cover:
  widget_type: shutter
  entity: cover.salon_cover
  title: תריס סלון
  title_style: "font-size: 1.5em;"
```

![HADashboard-widgets](https://github.com/rhayun/HADashboard-widgets/blob/master/images/with-slider.png?raw=true)

![HADashboard-widgets](https://github.com/rhayun/HADashboard-widgets/blob/master/images/without-slider.png?raw=true)


### [A Timer widget for HADashboard](https://github.com/rhayun/HADashboard-widgets/tree/master/custom_widgets/basetimer)

Timer widget for countdown

```yaml
timer1:
  widget_type: timer
  entity: timer.test
  title: Timer
  days_text: יום
  days_text_plural: ימים
  idle_text: לא פעיל
  times_up_text: הזמן נגמר
```
