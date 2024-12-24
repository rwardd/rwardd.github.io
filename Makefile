
all: index.html blog.html

clean:
	rm -f index.html
	make -C blog clean

index.html: index.md template.html Makefile
	pandoc --toc -s --css reset.css --css index.css -i $< -o $@ --template=template.html
blog.html:
	make -C blog

.PHONY: all clean
