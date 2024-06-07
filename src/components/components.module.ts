import { NgModule } from '@angular/core';
import { ShrinkingSegmentHeaderComponent } from './shrinking-segment-header/shrinking-segment-header';
import { HeaderComponent } from './header/header';
import { IonicModule } from 'ionic-angular'
@NgModule({
	declarations: [ShrinkingSegmentHeaderComponent,
    HeaderComponent],
	imports: [IonicModule],
	exports: [ShrinkingSegmentHeaderComponent,
    HeaderComponent]
})
export class ComponentsModule {}
